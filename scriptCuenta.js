function toggleEdicion(campo) {
    const fila    = document.getElementById('campo-' + campo);
    const valor   = document.getElementById('val-' + campo);
    const input   = document.getElementById('inp-' + campo);
    const msg     = document.getElementById('msg-' + campo);
    const btn     = fila.querySelector('.btn-editar');
    const editando = fila.classList.contains('editando');

    if (!editando) {
        // Abrir edición
        fila.classList.add('editando');
        btn.textContent = 'Guardar';
        btn.classList.add('guardar');
        msg.style.display = 'none';
        // Si es contraseña, limpiar el input al abrir
        if (campo === 'contrasena') input.value = '';
        input.focus();
    } else {
        // Guardar
        const nuevoValor = input.value.trim();

        if (nuevoValor !== '') {
            if (campo !== 'contrasena') {
                valor.textContent = nuevoValor;
                // Actualizar avatar y nombre en cabecera si toca
                actualizarCabecera();
            }
            // Mostrar mensaje de confirmación
            msg.style.display = 'block';
            setTimeout(() => { msg.style.display = 'none'; }, 2500);
        }

        // Cerrar edición
        fila.classList.remove('editando');
        btn.textContent = 'Editar';
        btn.classList.remove('guardar');
    }
}

function actualizarCabecera() {
    const nombre    = document.getElementById('val-nombre').textContent.trim();
    const apellidos = document.getElementById('val-apellidos').textContent.trim();
    const nombreCompleto = (nombre + ' ' + apellidos).trim();

    // Nombre mostrado
    document.getElementById('nombreMostrado').textContent = nombreCompleto;

    // Iniciales del avatar (hasta 2)
    const partes = nombreCompleto.split(' ').filter(Boolean);
    const iniciales = partes.slice(0, 2).map(p => p[0].toUpperCase()).join('');
    document.getElementById('avatarInicial').textContent = iniciales;
}

// Permitir guardar también con Enter
document.querySelectorAll('.perfil-campo-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const campo = input.id.replace('inp-', '');
            toggleEdicion(campo);
        }
        if (e.key === 'Escape') {
            const campo = input.id.replace('inp-', '');
            const fila  = document.getElementById('campo-' + campo);
            const btn   = fila.querySelector('.btn-editar');
            fila.classList.remove('editando');
            btn.textContent = 'Editar';
            btn.classList.remove('guardar');
        }
    });
});