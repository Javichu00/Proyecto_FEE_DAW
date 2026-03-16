const usuario = JSON.parse(sessionStorage.getItem('usuario'));

// Si no hay sesión redirige al login
if (!usuario) {
    window.location.href = 'acceso.html';
}

// Rellena los campos con los datos del usuario
document.getElementById('nombreMostrado').textContent = usuario.nombreCompleto;
document.getElementById('avatarInicial').textContent = usuario.nombreCompleto
    .split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
document.getElementById('val-nombreCompleto').textContent = usuario.nombreCompleto;
document.getElementById('inp-nombreCompleto').value = usuario.nombreCompleto;
document.getElementById('val-email').textContent = usuario.email;
document.getElementById('inp-email').value = usuario.email;

// Fecha de registro
if (usuario.fechaRegistro) {
    const fecha = new Date(usuario.fechaRegistro);
    document.getElementById('miembroDesde').textContent =
        'Miembro desde ' + fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

// Toggle edición
function toggleEdicion(campo) {
    const fila    = document.getElementById('campo-' + campo);
    const input   = document.getElementById('inp-' + campo);
    const valor   = document.getElementById('val-' + campo);
    const btn     = fila.querySelector('.btn-editar');
    const msg     = document.getElementById('msg-' + campo);
    const editando = fila.classList.contains('editando');

    if (!editando) {
        fila.classList.add('editando');
        btn.textContent = 'Guardar';
        btn.classList.add('guardar');
        msg.style.display = 'none';
        if (campo === 'contrasena') input.value = '';
        input.focus();
    } else {
        const nuevoValor = input.value.trim();
        if (!nuevoValor) return;
        guardarCampo(campo, nuevoValor);
    }
}

async function guardarCampo(campo, nuevoValor) {
    const fila   = document.getElementById('campo-' + campo);
    const input  = document.getElementById('inp-' + campo);
    const valor  = document.getElementById('val-' + campo);
    const btn    = fila.querySelector('.btn-editar');
    const msg    = document.getElementById('msg-' + campo);

    if (campo === 'nombreCompleto') usuario.nombreCompleto = nuevoValor;
    if (campo === 'email')          usuario.email = nuevoValor;
    if (campo === 'contrasena')     usuario.password = nuevoValor;

    try {
        const response = await fetch(`${API}/usuarios`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            const actualizado = await response.json();
            sessionStorage.setItem('usuario', JSON.stringify(actualizado));

            if (campo !== 'contrasena') {
                valor.textContent = nuevoValor;
                // Actualiza cabecera si cambió el nombre
                if (campo === 'nombreCompleto') {
                    document.getElementById('nombreMostrado').textContent = nuevoValor;
                    document.getElementById('avatarInicial').textContent = nuevoValor
                        .split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
                    actualizarHeader();
                }
            }

            fila.classList.remove('editando');
            btn.textContent = 'Editar';
            btn.classList.remove('guardar');
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 2500);

        } else {
            alert('Error al guardar');
        }
    } catch (error) {
        console.error(error);
        alert('No se puede conectar con el servidor');
    }
}

// Enter y Escape
document.querySelectorAll('.perfil-campo-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
        const campo = input.id.replace('inp-', '');
        if (e.key === 'Enter') toggleEdicion(campo);
        if (e.key === 'Escape') {
            const fila = document.getElementById('campo-' + campo);
            const btn  = fila.querySelector('.btn-editar');
            fila.classList.remove('editando');
            btn.textContent = 'Editar';
            btn.classList.remove('guardar');
        }
    });
});

// Cerrar sesión
function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'index.html';
}