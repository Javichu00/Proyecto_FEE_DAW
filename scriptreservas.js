const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'acceso.html';
}

async function cargarReservas() {
    try {
        const res = await fetch(`${API}/reservas`);
        if (!res.ok) {
            mostrarVacio();
            return;
        }

        const todasReservas = await res.json();

        // Filtra solo las del usuario logado
        const misReservas = todasReservas.filter(r => r.usuario?.idUsuario === usuario.idUsuario);

        const lista = document.getElementById('listaReservas');
        const vacio = document.getElementById('reservasVacio');
        const contador = document.getElementById('contadorReservas');

        lista.innerHTML = '';

        if (misReservas.length === 0) {
            vacio.style.display = 'block';
            contador.textContent = '0 reservas registradas';
            return;
        }

        contador.textContent = `${misReservas.length} reserva${misReservas.length > 1 ? 's' : ''} registrada${misReservas.length > 1 ? 's' : ''}`;

        const formatEur = n => parseFloat(n).toFixed(2).replace('.', ',') + '€';

        misReservas.forEach(r => {
            const fechaInicio = r.evento?.fechaInicio
                ? new Date(r.evento.fechaInicio).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase()
                : '—';

            lista.innerHTML += `
                <div class="reserva-item confirmada">
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
                        </div>
                    </div>

                    <div class="reserva-derecha">
                        <div class="reserva-precio">${formatEur(r.precioVenta)}</div>
                        <span class="reserva-estado confirmada">Confirmada</span>
                        <span class="reserva-personas">${r.cantidad} persona${r.cantidad > 1 ? 's' : ''}</span>
                    </div>
                </div>
            `;
        });

    } catch (e) {
        console.error(e);
    }
}

function mostrarVacio() {
    document.getElementById('listaReservas').innerHTML = '';
    document.getElementById('reservasVacio').style.display = 'block';
    document.getElementById('contadorReservas').textContent = '0 reservas registradas';
}

cargarReservas();