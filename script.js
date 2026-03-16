function actualizarHeader() {
    const usuarioJson = sessionStorage.getItem('usuario');
    const btnAcceder = document.querySelector('.btn-acceder');
    if (!btnAcceder) return;

    if (usuarioJson) {
        const usuario = JSON.parse(usuarioJson);
        const nombre = usuario.nombreCompleto.split(' ')[0];
        btnAcceder.textContent = `Hola, ${nombre}`;
        btnAcceder.href = './cuenta.html';
        btnAcceder.classList.add('btn-reservas');
    } else {
        btnAcceder.textContent = 'Acceder';
        btnAcceder.href = './acceso.html';
        btnAcceder.classList.remove('btn-reservas');
    }
}

actualizarHeader();