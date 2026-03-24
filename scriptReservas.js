const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'acceso.html';
}

const formatEur = n => parseFloat(n).toFixed(2).replace('.', ',') + '€';

async function cargarReservas() {
    try {
        const res = await fetch(`${API}/reservas`);
        if (!res.ok) { mostrarVacio(); return; }

        const todasReservas = await res.json();
        const misReservas = todasReservas.filter(r => r.usuario?.idUsuario === usuario.idUsuario);

        const lista    = document.getElementById('listaReservas');
        const vacio    = document.getElementById('reservasVacio');
        const contador = document.getElementById('contadorReservas');

        lista.innerHTML = '';
        vacio.style.display = 'none';

        if (misReservas.length === 0) {
            mostrarVacio();
            return;
        }

        contador.textContent = `${misReservas.length} reserva${misReservas.length > 1 ? 's' : ''} registrada${misReservas.length > 1 ? 's' : ''}`;

        misReservas.forEach(r => {
            const fechaInicio = r.evento?.fechaInicio
                ? new Date(r.evento.fechaInicio).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase()
                : '—';

            const precioUnitario = r.evento?.precio || 0;

            lista.innerHTML += `
                <div class="reserva-item confirmada" id="reserva-${r.idReserva}">
                    <img class="reserva-foto" src="${r.evento?.rutaFoto || ''}"
                         onerror="this.style.display='none'"
                         alt="${r.evento?.nombre || ''}">

                    <div class="reserva-info">
                        <div class="reserva-nombre">${r.evento?.nombre || '—'}</div>
                        <div class="reserva-meta">
                            <div class="reserva-meta-item">
                                <span class="reserva-meta-label">Fecha</span>
                                <span class="reserva-meta-valor">${fechaInicio}</span>
                            </div>
                            <div class="reserva-meta-item">
                                <span class="reserva-meta-label">Ubicación</span>
                                <span class="reserva-meta-valor">${r.evento?.localizacion || '—'}</span>
                            </div>
                            <div class="reserva-meta-item">
                                <span class="reserva-meta-label">Referencia</span>
                                <span class="reserva-meta-valor">#SX-${String(r.idReserva).padStart(5, '0')}</span>
                            </div>
                            <div class="reserva-meta-item">
                                <span class="reserva-meta-label">Entradas</span>
                                <div style="display:flex;align-items:center;gap:8px;margin-top:4px;">
                                    <button onclick="cambiarCantidad(${r.idReserva}, -1, ${precioUnitario})"
                                        style="background:#2a2a2a;border:1px solid #444;color:white;width:26px;height:26px;border-radius:4px;cursor:pointer;font-size:1rem;">−</button>
                                    <span id="cant-${r.idReserva}" style="color:white;font-weight:700;min-width:20px;text-align:center;">${r.cantidad}</span>
                                    <button onclick="cambiarCantidad(${r.idReserva}, +1, ${precioUnitario})"
                                        style="background:#2a2a2a;border:1px solid #444;color:white;width:26px;height:26px;border-radius:4px;cursor:pointer;font-size:1rem;">+</button>
                                    <button id="btn-guardar-${r.idReserva}" onclick="guardarCantidad(${r.idReserva})"
                                        style="display:none;background:var(--rojo-oscuro);border:none;color:white;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px;">Guardar</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="reserva-derecha">
                        <div class="reserva-precio" id="precio-${r.idReserva}">${formatEur(r.precioVenta)}</div>
                        <span class="reserva-estado confirmada">Confirmada</span>
                        <span class="reserva-personas" id="personas-${r.idReserva}">${r.cantidad} persona${r.cantidad > 1 ? 's' : ''}</span>
                        <button onclick="anularReserva(${r.idReserva})"
                            style="background:rgba(167,1,14,0.15);border:1px solid var(--rojo-oscuro);color:#ff6b6b;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:11px;margin-top:4px;transition:0.2s;"
                            onmouseover="this.style.background='var(--rojo-oscuro)';this.style.color='white'"
                            onmouseout="this.style.background='rgba(167,1,14,0.15)';this.style.color='#ff6b6b'">
                            Anular reserva
                        </button>
                    </div>
                </div>
            `;
        });

        // Guarda las reservas en memoria para usarlas al guardar
        window._misReservas = misReservas;

    } catch (e) {
        console.error(e);
    }
}

function cambiarCantidad(idReserva, delta, precioUnitario) {
    const cantEl   = document.getElementById(`cant-${idReserva}`);
    const precioEl = document.getElementById(`precio-${idReserva}`);
    const personasEl = document.getElementById(`personas-${idReserva}`);
    const btnGuardar = document.getElementById(`btn-guardar-${idReserva}`);

    let cant = parseInt(cantEl.textContent) + delta;
    if (cant < 1) cant = 1;
    if (cant > 10) cant = 10;

    cantEl.textContent = cant;
    precioEl.textContent = formatEur(precioUnitario * cant);
    personasEl.textContent = `${cant} persona${cant > 1 ? 's' : ''}`;
    btnGuardar.style.display = 'inline-block';
}

async function guardarCantidad(idReserva) {
    const cant = parseInt(document.getElementById(`cant-${idReserva}`).textContent);
    const reserva = window._misReservas.find(r => r.idReserva === idReserva);
    if (!reserva) return;

    // Comprobar aforo disponible
    const resAforo = await fetch(`${API}/reservas/evento/${reserva.evento.idEvento}/aforo`);
    const ocupado = await resAforo.json();
    const aforoMaximo = reserva.evento.aforoMaximo;
    // El aforo ocupado incluye la reserva actual, así que restamos la cantidad actual
    const cantidadActual = reserva.cantidad;
    const libre = aforoMaximo - ocupado + cantidadActual;

    if (cant > libre) {
        alert(`Solo quedan ${libre} plaza${libre !== 1 ? 's' : ''} disponibles para este evento.`);
        // Revierte el contador visual
        document.getElementById(`cant-${idReserva}`).textContent = cantidadActual;
        document.getElementById(`precio-${idReserva}`).textContent = formatEur(reserva.evento.precio * cantidadActual);
        document.getElementById(`personas-${idReserva}`).textContent = `${cantidadActual} persona${cantidadActual > 1 ? 's' : ''}`;
        document.getElementById(`btn-guardar-${idReserva}`).style.display = 'none';
        return;
    }

    const precioVenta = (reserva.evento?.precio || 0) * cant;

    try {
        const res = await fetch(`${API}/reservas`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...reserva, cantidad: cant, precioVenta })
        });

        if (res.ok) {
            reserva.cantidad = cant; // actualiza el objeto local
            document.getElementById(`btn-guardar-${idReserva}`).style.display = 'none';
        } else {
            alert('Error al guardar');
        }
    } catch (e) {
        console.error(e);
        alert('No se puede conectar con el servidor');
    }
}

async function anularReserva(idReserva) {
    if (!confirm('¿Seguro que quieres anular esta reserva? Esta acción no se puede deshacer.')) return;

    try {
        const res = await fetch(`${API}/reservas/${idReserva}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            document.getElementById(`reserva-${idReserva}`).remove();
            // Actualiza el contador
            const lista = document.getElementById('listaReservas');
            const total = lista.querySelectorAll('.reserva-item').length;
            if (total === 0) {
                mostrarVacio();
            } else {
                document.getElementById('contadorReservas').textContent =
                    `${total} reserva${total > 1 ? 's' : ''} registrada${total > 1 ? 's' : ''}`;
            }
        } else {
            alert('Error al anular la reserva');
        }
    } catch (e) {
        console.error(e);
        alert('No se puede conectar con el servidor');
    }
}

function mostrarVacio() {
    document.getElementById('listaReservas').innerHTML = '';
    document.getElementById('reservasVacio').style.display = 'block';
    document.getElementById('contadorReservas').textContent = '0 reservas registradas';
}

cargarReservas();
