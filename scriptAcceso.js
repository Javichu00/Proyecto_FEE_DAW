// Tabs
function showTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.remove('hidden');
    btn.classList.add('active');
}

// Mostrar/ocultar contraseña
function togglePass(id, btn) {
    const input = document.getElementById(id);
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁️' : '🙈';
}

// LOGIN
async function login() {
    const email    = document.getElementById('login-email').value.trim();
    const password = document.getElementById('pass3').value.trim();

    if (!email || !password) {
        alert('Rellena todos los campos');
        return;
    }

    try {
        const response = await fetch(`${API}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (response.ok) {
            const usuario = await response.json();
            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            
            // Si es admin (perfil id=1) va al panel, si no al index
            if (usuario.perfil.idPerfil === 1) {
                window.location.href = 'indexAdmn.html';
            } else {
                window.location.href = 'index.html';
            }
        } else if (response.status === 401) {
            alert('Email o contraseña incorrectos');
        } else if (response.status === 403) {
            alert('Tu cuenta está desactivada. Contacta con el administrador.');
        } else {
            alert('Error al iniciar sesión');
        }

    } catch (error) {
        console.error(error);
        alert('No se puede conectar con el servidor');
    }
}

// REGISTRO
async function register() {
    const nombre   = document.getElementById('reg-nombre').value.trim();
    const email    = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('pass1').value.trim();
    const confirm  = document.getElementById('pass2').value.trim();

    if (!nombre || !email || !password || !confirm) {
        alert('Rellena todos los campos');
        return;
    }

    if (password !== confirm) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch(`${API}/usuarios/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombreCompleto: nombre, email, password })
        });

        if (response.status === 201) {
            alert('Cuenta creada correctamente, ya puedes iniciar sesión');
            // Cambiamos al tab de login
            document.querySelector('.tab:last-child').click();
        } else if (response.status === 409) {
            alert('Ese email ya está registrado');
        } else {
            alert('Error al registrarse');
        }

    } catch (error) {
        console.error(error);
        alert('No se puede conectar con el servidor');
    }
}