const usuario = JSON.parse(sessionStorage.getItem('usuario'));


if (!usuario) {
    window.location.href = 'acceso.html';
}


const liAdmin = document.getElementById('li-admin');
if (liAdmin) liAdmin.style.display = 'none';


if (usuario.perfil?.idPerfil === 1) {
   
    document.querySelector('.main-nav').style.display = 'none';
    const btnReservas = document.querySelector('.btn-reservas');
    const img = document.getElementById("IMAGEN-LOGO")
    if (btnReservas) {
        img.href = ''
        btnReservas.textContent = 'Dashboard';
        btnReservas.href = './indexAdmn.html';
    }
}
else if (usuario.perfil?.idPerfil === 3) {
    
    document.querySelector('.main-nav').style.display = 'none';
    const btnReservas = document.querySelector('.btn-reservas');
    
    const img = document.getElementById("IMAGEN-LOGO")
    if (btnReservas) {
        img.href = ''
        btnReservas.textContent = 'Crear Evento';
        btnReservas.href = './proveedor.html';
    }
}


document.getElementById('nombreMostrado').textContent = usuario.nombreCompleto;
document.getElementById('avatarInicial').textContent = usuario.nombreCompleto
    .split(' ').filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase()).join('');
document.getElementById('val-nombreCompleto').textContent = usuario.nombreCompleto;
document.getElementById('inp-nombreCompleto').value = usuario.nombreCompleto;
document.getElementById('val-email').textContent = usuario.email;
document.getElementById('inp-email').value = usuario.email;

if (usuario.fechaRegistro) {
    const fecha = new Date(usuario.fechaRegistro);
    document.getElementById('miembroDesde').textContent =
        'Miembro desde ' + fecha.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

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


function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'index.html';
}


let _popupModo = null; 

function abrirPopup(titulo, descripcion, modo, mostrarNuevaPass) {
    _popupModo = modo;
    document.getElementById('popupTitulo').textContent = titulo;
    document.getElementById('popupDescripcion').textContent = descripcion;
    document.getElementById('popupPassword').value = '';
    document.getElementById('popupNuevaPass').value = '';
    document.getElementById('popupError').style.display = 'none';
    document.getElementById('popupNuevaPassWrapper').style.display = mostrarNuevaPass ? 'block' : 'none';

    const btnConfirmar = document.getElementById('popupBtnConfirmar');
    if (modo === 'eliminar') {
        btnConfirmar.textContent = 'Eliminar cuenta';
        btnConfirmar.classList.add('peligro');
    } else {
        btnConfirmar.textContent = 'Guardar';
        btnConfirmar.classList.remove('peligro');
    }

    document.getElementById('popupOverlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('popupPassword').focus(), 100);
}

function cerrarPopup() {
    document.getElementById('popupOverlay').classList.add('hidden');
    _popupModo = null;
}

function abrirPopupPassword() {
    abrirPopup(
        'Cambiar contraseña',
        'Introduce tu contraseña actual y la nueva para continuar.',
        'password',
        true
    );
}

function abrirPopupEliminar() {
    abrirPopup(
        'Eliminar cuenta',
        'Introduce tu contraseña para confirmar. Esta acción no se puede deshacer.',
        'eliminar',
        false
    );
}

async function confirmarPopup() {
    const passActual   = document.getElementById('popupPassword').value.trim();
    const errorEl      = document.getElementById('popupError');

    errorEl.style.display = 'none';

    if (!passActual) {
        errorEl.textContent = 'Introduce tu contraseña';
        errorEl.style.display = 'block';
        return;
    }

    
    if (passActual !== usuario.password) {
        errorEl.textContent = 'Contraseña incorrecta';
        errorEl.style.display = 'block';
        return;
    }

    if (_popupModo === 'password') {
        const nuevaPass = document.getElementById('popupNuevaPass').value.trim();
        if (!nuevaPass) {
            errorEl.textContent = 'Introduce la nueva contraseña';
            errorEl.style.display = 'block';
            return;
        }
        cerrarPopup();
        await guardarCampo('contrasena', nuevaPass);

    } else if (_popupModo === 'eliminar') {
        cerrarPopup();
        await eliminarCuenta();
    }
}

async function eliminarCuenta() {
    try {
        const res = await fetch(`${API}/usuarios/${usuario.idUsuario}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            sessionStorage.removeItem('usuario');
            alert('Tu cuenta ha sido eliminada.');
            window.location.href = 'index.html';
        } else {
            alert('Error al eliminar la cuenta');
        }
    } catch (e) {
        console.error(e);
        alert('No se puede conectar con el servidor');
    }
}


document.getElementById('popupOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('popupOverlay')) cerrarPopup();
});


document.getElementById('popupPassword').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const nuevaPassWrapper = document.getElementById('popupNuevaPassWrapper');
        if (nuevaPassWrapper.style.display !== 'none') {
            document.getElementById('popupNuevaPass').focus();
        } else {
            confirmarPopup();
        }
    }
});

document.getElementById('popupNuevaPass').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmarPopup();
});