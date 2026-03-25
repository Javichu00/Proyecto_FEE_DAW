const params = new URLSearchParams(window.location.search);
const idEvento = params.get('id');

if (!idEvento) {
    alert('No se ha especificado ningún evento');
    window.location.href = 'index.html';
}

async function cargarEvento() {
    try {
        const res = await fetch(`${API}/eventos/${idEvento}`);
        if (!res.ok) {
            alert('Evento no encontrado');
            window.location.href = 'index.html';
            return;
        }

        const e = await res.json();

        document.getElementById('heroNombre').textContent = e.nombre;

        document.getElementById('eventoNombre').textContent = e.nombre;
        document.getElementById('eventoDesc').textContent = e.descripcion;
        document.getElementById('eventoCat').textContent = e.categoria;
        document.getElementById('eventoNivel').textContent = e.extremidad;

        const foto = document.querySelector('.reserva-hero-img');
        const fotoFicha = document.querySelector('.evento-foto');
        if (foto) foto.src = e.rutaFoto;
        if (fotoFicha) fotoFicha.src = e.rutaFoto;

        document.getElementById('fechaInicio').textContent = e.fechaInicio
            ? new Date(e.fechaInicio).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase()
            : '—';
        document.getElementById('fechaFin').textContent = e.fechaFin
            ? new Date(e.fechaFin).toLocaleDateString('es-ES', { day:'2-digit', month:'short', year:'numeric' }).toUpperCase()
            : '—';
        document.getElementById('eventoUbicacion').textContent = e.localizacion || '—';

        const resAforo = await fetch(`${API}/reservas/evento/${idEvento}/aforo`);
        const ocupado = await resAforo.json();
        const libre = e.aforoMaximo - ocupado;
        document.getElementById('eventoAforo').textContent = `${libre} / ${e.aforoMaximo}`;

        const precioEvento = e.precio;
        const formatEur = n => n.toFixed(2).replace('.', ',') + '€';
        document.getElementById('eventoPrecioDisplay').textContent = formatEur(precioEvento);
        document.getElementById('formPrecio').textContent = formatEur(precioEvento);

        let asistentes = 1;
        const maxPersonas = Math.min(libre, 10);

        function actualizarResumen() {
            const total = precioEvento * asistentes;
            document.getElementById('numAsistentes').textContent = asistentes;
            document.getElementById('resumenLinea').textContent =
                asistentes + ' persona' + (asistentes > 1 ? 's' : '') + ' × ' + formatEur(precioEvento);
            document.getElementById('resumenParcial').textContent = formatEur(total);
            document.getElementById('totalPrecio').textContent = formatEur(total);
        }

        actualizarResumen();

        document.getElementById('btnMenos').addEventListener('click', () => {
            if (asistentes > 1) { asistentes--; actualizarResumen(); }
        });

        document.getElementById('btnMas').addEventListener('click', () => {
            if (asistentes < maxPersonas) { asistentes++; actualizarResumen(); }
        });

        if (libre <= 0) {
            const btnConfirmar = document.getElementById('btnConfirmar');
            btnConfirmar.disabled = true;
            btnConfirmar.textContent = 'Sin plazas disponibles';
            btnConfirmar.style.opacity = '0.5';
            btnConfirmar.style.cursor = 'not-allowed';
        }

        document.getElementById('btnConfirmar').addEventListener('click', async () => {
            const usuario = JSON.parse(sessionStorage.getItem('usuario'));
            if (!usuario) {
                alert('Debes iniciar sesión para reservar');
                window.location.href = 'acceso.html';
                return;
            }

            const precioVenta = precioEvento * asistentes;

            try {
                const res = await fetch(`${API}/reservas`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        usuario:  { idUsuario: usuario.idUsuario },
                        evento:   { idEvento: parseInt(idEvento) },
                        cantidad: asistentes,
                        precioVenta
                    })
                });

                if (res.status === 201) {
                    alert('¡Reserva confirmada!');
                    window.location.href = 'reservas.html';
                } else if (res.status === 409) {
                    alert('Ya tienes una reserva para este evento. Puedes modificarla desde Mis Reservas.');
                    window.location.href = 'reservas.html';
                } else {
                    alert('Error al confirmar la reserva');
                }
            } catch (err) {
                console.error(err);
                alert('No se puede conectar con el servidor');
            }
        });

    } catch (err) {
        console.error(err);
        alert('Error cargando el evento');
    }
}

cargarEvento();