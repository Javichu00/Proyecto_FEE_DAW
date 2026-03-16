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

const usuario = JSON.parse(sessionStorage.getItem('usuario'));

if (!usuario) {
    // Si no hay sesión redirige al login
    window.location.href = 'acceso.html';
}

// Rellena los campos con los datos del usuario
document.getElementById('nombreMostrado').textContent = usuario.nombreCompleto;
document.getElementById('avatarInicial').textContent = usuario.nombreCompleto
    .split(' ').map(p => p[0]).join('').substring(0, 2).toUpperCase();
document.getElementById('val-nombre').textContent = usuario.nombreCompleto;
document.getElementById('inp-nombre').value = usuario.nombreCompleto;
document.getElementById('val-email').textContent = usuario.email;
document.getElementById('inp-email').value = usuario.email;

// Función para editar campos
function toggleEdicion(campo) {
    const valor = document.getElementById(`val-${campo}`);
    const input = document.getElementById(`inp-${campo}`);
    const btn   = document.querySelector(`#campo-${campo} .btn-editar`);
    const msg   = document.getElementById(`msg-${campo}`);

    const editando = input.style.display === 'block';

    if (editando) {
        // Guardar
        guardarCampo(campo, input.value);
    } else {
        // Mostrar input
        valor.style.display = 'none';
        input.style.display = 'block';
        input.focus();
        btn.textContent = 'Guardar';
        msg.style.display = 'none';
    }
}

async function guardarCampo(campo, valor) {
    const input  = document.getElementById(`inp-${campo}`);
    const valorEl = document.getElementById(`val-${campo}`);
    const btn    = document.querySelector(`#campo-${campo} .btn-editar`);
    const msg    = document.getElementById(`msg-${campo}`);

    // Actualiza el objeto localmente
    if (campo === 'nombre') usuario.nombreCompleto = valor;
    if (campo === 'email')  usuario.email = valor;
    if (campo === 'contrasena') usuario.password = valor;

    try {
        const response = await fetch(`${API}/usuarios`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });

        if (response.ok) {
            const actualizado = await response.json();
            sessionStorage.setItem('usuario', JSON.stringify(actualizado));

            valorEl.textContent = campo === 'contrasena' ? '••••••••' : valor;
            valorEl.style.display = 'block';
            input.style.display = 'none';
            btn.textContent = 'Editar';
            msg.style.display = 'block';
            setTimeout(() => msg.style.display = 'none', 2000);
        } else {
            alert('Error al guardar');
        }
    } catch (error) {
        console.error(error);
        alert('No se puede conectar con el servidor');
    }
}