const grid = document.getElementById('actividadesGrid');
const contador = document.getElementById('contador');

const difMap = {
    SUAVE:   { clase: 'dif-facil',   texto: 'Fácil' },
    MEDIO:   { clase: 'dif-media',   texto: 'Media' },
    DURO:    { clase: 'dif-dificil', texto: 'Difícil' },
    EXTREMO: { clase: 'dif-extremo', texto: 'Extremo' }
};

const catMap = {
    AIRE:   'Aire',
    MAR:    'Mar',
    TIERRA: 'Tierra'
};

function ordenarLista(lista) {
    const orden = document.getElementById('orden-select').value;
    const copia = [...lista];
    switch (orden) {
        case 'precio-asc':  return copia.sort((a, b) => a.precio - b.precio);
        case 'precio-desc': return copia.sort((a, b) => b.precio - a.precio);
        case 'fecha-asc':   return copia.sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
        case 'fecha-desc':  return copia.sort((a, b) => new Date(b.fechaInicio) - new Date(a.fechaInicio));
        case 'nombre-asc':  return copia.sort((a, b) => a.nombre.localeCompare(b.nombre));
        default:            return copia;
    }
}

function renderLista(lista) {
    contador.textContent = `(${lista.length})`;
    grid.innerHTML = '';

    if (lista.length === 0) {
        grid.innerHTML = '<p style="color:white;grid-column:1/-1">No se encontraron actividades.</p>';
        return;
    }

    ordenarLista(lista).forEach(a => {
        const dif = difMap[a.extremidad] || { clase: '', texto: a.extremidad };
        const cat = catMap[a.categoria] || a.categoria;
        const fecha = a.fechaInicio ? new Date(a.fechaInicio).toLocaleDateString('es-ES') : '';

        grid.innerHTML += `
            <div class="actividad-card">
                <div class="actividad-img">
                    <img src="${a.rutaFoto}"
                         onerror="this.parentElement.style.background='#2a2a2a'"
                         style="width:100%;height:100%;object-fit:cover;">
                    <div style="position:absolute;top:10px;right:10px;display:flex;gap:6px;z-index:1;">
                        <span class="actividad-categoria">${cat}</span>
                        <span class="actividad-dificultad ${dif.clase}">${dif.texto}</span>
                    </div>
                </div>
                <div class="actividad-info">
                    <h4>${a.nombre}</h4>
                    <p>${a.descripcion.substring(0, 100)}...</p>
                    <div class="actividad-meta">
                        <span>📍 ${a.localizacion}</span>
                        <span>👥 Aforo: ${a.aforoMaximo}</span>
                        <span>📅 ${fecha}</span>
                    </div>
                    <div class="actividad-footer">
                        <span class="actividad-precio">${a.precio}€</span>
                        <a href="reservarEvento.html?id=${a.idEvento}" class="btn-reservar">Reservar</a>
                    </div>
                </div>
            </div>
        `;
    });
}

let listaActual = [];

async function cargarActividades(filtros = {}) {
    try {
        const response = await fetch(`${API}/eventos/filtrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idTipo: 3, ...filtros })
        });

        if (response.status === 204) {
            listaActual = [];
            renderLista([]);
            return;
        }

        listaActual = await response.json();
        renderLista(listaActual);

        // Solo actualiza los sliders en la carga inicial (sin filtros)
        if (Object.keys(filtros).length === 0) {
            actualizarSliders(listaActual);
        }

    } catch (error) {
        console.error('Error:', error);
        grid.innerHTML = '<p style="color:red;grid-column:1/-1">Error conectando con el servidor.</p>';
    }
}

function actualizarSliders(lista) {
    const maxPrecio = Math.ceil(Math.max(...lista.map(a => a.precio)));
    const maxAforo  = Math.max(...lista.map(a => a.aforoMaximo));

    // Precio
    document.getElementById('filtro-precio-min').max = maxPrecio;
    document.getElementById('filtro-precio-max').max = maxPrecio;
    document.getElementById('filtro-precio-max').value = maxPrecio;
    document.getElementById('precio-max-val').textContent = maxPrecio;

    // Aforo
    document.getElementById('filtro-aforo').max = maxAforo;
    document.getElementById('aforo-val').textContent = '1';

    // También actualiza el limpiar para usar estos máximos reales
    window._maxPrecio = maxPrecio;
    window._maxAforo  = maxAforo;
}

function aplicarFiltros() {
    const filtros = {};

    const categorias = [...document.querySelectorAll('#checks-categoria input:checked')]
        .map(cb => cb.value);
    if (categorias.length > 0) filtros.categorias = categorias;

    const extremidades = [...document.querySelectorAll('#checks-dificultad input:checked')]
        .map(cb => cb.value);
    if (extremidades.length > 0) filtros.extremidades = extremidades;

    const precioMin = parseInt(document.getElementById('filtro-precio-min').value);
    const precioMax = parseInt(document.getElementById('filtro-precio-max').value);
    if (precioMin > 0)    filtros.precioMin = precioMin;
    if (precioMax < 1000) filtros.precioMax = precioMax;

    const fechaMin = document.getElementById('filtro-fecha-min').value;
    const fechaMax = document.getElementById('filtro-fecha-max').value;
    if (fechaMin) filtros.fechaMin = fechaMin;
    if (fechaMax) filtros.fechaMax = fechaMax;

    const aforo = parseInt(document.getElementById('filtro-aforo').value);
    if (aforo > 1) filtros.aforoMinimo = aforo;

    const nombre = document.getElementById('buscador').value.trim();
    if (nombre) filtros.nombre = nombre;

    cargarActividades(filtros);
}

// Listeners automáticos
document.querySelectorAll('.filtro-checks input').forEach(cb => {
    cb.addEventListener('change', aplicarFiltros);
});
document.getElementById('filtro-precio-min').addEventListener('input', aplicarFiltros);
document.getElementById('filtro-precio-max').addEventListener('input', aplicarFiltros);
document.getElementById('filtro-fecha-min').addEventListener('change', aplicarFiltros);
document.getElementById('filtro-fecha-max').addEventListener('change', aplicarFiltros);
document.getElementById('filtro-aforo').addEventListener('input', aplicarFiltros);
document.getElementById('buscador').addEventListener('input', aplicarFiltros);

// Ordenar sin rellamar a la API
document.getElementById('orden-select').addEventListener('change', () => {
    renderLista(listaActual);
});

// Limpiar
document.querySelector('.btn-reset').addEventListener('click', () => {
    document.querySelectorAll('.filtro-checks input').forEach(cb => cb.checked = false);
    document.getElementById('filtro-precio-min').value = 0;
    document.getElementById('filtro-precio-max').value = window._maxPrecio || 1000;
    document.getElementById('precio-min-val').textContent = '0';
    document.getElementById('precio-max-val').textContent = window._maxPrecio || 1000;
    document.getElementById('filtro-fecha-min').value = '';
    document.getElementById('filtro-fecha-max').value = '';
    document.getElementById('filtro-aforo').value = 1;
    document.getElementById('aforo-val').textContent = '1';
    document.getElementById('buscador').value = '';
    cargarActividades();
});
// Carga inicial
cargarActividades();