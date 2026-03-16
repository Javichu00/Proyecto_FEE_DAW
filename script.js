function actualizarHeader() {
    const usuarioJson = sessionStorage.getItem('usuario');
    const btnAcceder = document.querySelector('a[href="./acceso.html"]');
    if (!btnAcceder) return;

    if (usuarioJson) {
        const usuario = JSON.parse(usuarioJson);
        const nombre = usuario.nombreCompleto.split(' ')[0]; // Solo el primer nombre

        // Reemplaza el botón "Acceder" por "Hola Pepe"
        btnAcceder.textContent = `Hola, ${nombre}`;
        btnAcceder.href = './cuenta.html';
        btnAcceder.classList.remove('btn-menu');
        btnAcceder.classList.add('btn-menu', 'btn-reservas'); // mismo estilo que "Mis Reservas"
    }
}

actualizarHeader();