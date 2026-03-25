const idTipoMap = {
    'show.html':      1,
    'actividad.html': 2,
    'curso.html':     3
};

const pagina = window.location.pathname.split('/').pop();
const idTipo = idTipoMap[pagina];
const grid    = document.getElementById('actividadesGrid');
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

/* ── Skeletons ────────────────────────────────────── */
function mostrarSkeletons(n = 6) {
    contador.textContent = '';
    grid.innerHTML = Array(n).fill(`
        <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
                <div class="skeleton-line title"></div>
                <div class="skeleton-line text"></div>
                <div class="skeleton-line text2"></div>
                <div class="skeleton-line meta"></div>
                <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid #2a2a2a;">
                    <div class="skeleton-line price"></div>
                    <div class="skeleton-line btn"></div>
                </div>
            </div>
        </div>
    `).join('');
}

/* ── Ordenar ──────────────────────────────────────── */
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

/* ── Render tarjetas ──────────────────────────────── */
function renderLista(lista) {
    contador.textContent = `(${lista.length})`;
    grid.innerHTML = '';

    if (lista.length === 0) {
        grid.innerHTML = '<p style="color:white;grid-column:1/-1">No se encontraron actividades.</p>';
        return;
    }

    ordenarLista(lista).forEach(a => {
        const dif   = difMap[a.extremidad] || { clase: '', texto: a.extremidad };
        const cat   = catMap[a.categoria]  || a.categoria;
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

/* ── Cargar actividades ───────────────────────────── */
async function cargarActividades(filtros = {}) {
    mostrarSkeletons();
    try {
        const response = await fetch(`${API}/eventos/filtrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idTipo, ...filtros })
        });

        if (response.status === 204) {
            listaActual = [];
            renderLista([]);
            return;
        }

        listaActual = await response.json();
        renderLista(listaActual);

        if (Object.keys(filtros).length === 0) {
            actualizarSliders(listaActual);
        }

    } catch (error) {
        console.error('Error:', error);
        grid.innerHTML = '<p style="color:red;grid-column:1/-1">Error conectando con el servidor.</p>';
    }
}

/* ── Actualizar sliders con datos reales ─────────── */
function actualizarSliders(lista) {
    const maxPrecio = Math.ceil(Math.max(...lista.map(a => a.precio)));
    const maxAforo  = Math.max(...lista.map(a => a.aforoMaximo));

    document.getElementById('filtro-precio-min').max = maxPrecio;
    document.getElementById('filtro-precio-max').max = maxPrecio;
    document.getElementById('filtro-precio-max').value = maxPrecio;
    document.getElementById('precio-max-val').textContent = maxPrecio;

    document.getElementById('filtro-aforo').max = maxAforo;
    document.getElementById('aforo-val').textContent = '1';

    window._maxPrecio = maxPrecio;
    window._maxAforo  = maxAforo;
}

/* ── Aplicar filtros ──────────────────────────────── */
function aplicarFiltros() {
    const filtros = {};

    const categorias = [...document.querySelectorAll('#checks-categoria input:checked')].map(cb => cb.value);
    if (categorias.length > 0) filtros.categorias = categorias;

    const extremidades = [...document.querySelectorAll('#checks-dificultad input:checked')].map(cb => cb.value);
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

/* ── Limpiar filtros ──────────────────────────────── */
function limpiarFiltros() {
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
}

/* ── Listeners de filtros ─────────────────────────── */
document.querySelectorAll('.filtro-checks input').forEach(cb => cb.addEventListener('change', aplicarFiltros));
document.getElementById('filtro-precio-min').addEventListener('input', aplicarFiltros);
document.getElementById('filtro-precio-max').addEventListener('input', aplicarFiltros);
document.getElementById('filtro-fecha-min').addEventListener('change', aplicarFiltros);
document.getElementById('filtro-fecha-max').addEventListener('change', aplicarFiltros);
document.getElementById('filtro-aforo').addEventListener('input', aplicarFiltros);
document.getElementById('buscador').addEventListener('input', aplicarFiltros);
document.getElementById('orden-select').addEventListener('change', () => renderLista(listaActual));
document.querySelector('.btn-reset').addEventListener('click', function() {
    limpiarFiltros();
    cerrarPanel();
});

/* ── Cargar destacados ────────────────────────────── */
async function cargarDestacados() {
    // Skeleton del carrusel mientras carga
    const contenedorSkel = document.getElementById('destacadosContenedor');
    contenedorSkel.style.display = 'block';
    contenedorSkel.innerHTML = `
        <div class="skeleton-destacado" style="position:relative;overflow:hidden;">
            <div class="skeleton-destacado-img skeleton-line" style="position:absolute;right:0;top:0;"></div>
            <div class="skeleton-destacado-content">
                <div class="skeleton-line" style="height:11px;width:40%;margin-bottom:4px;"></div>
                <div class="skeleton-line" style="height:32px;width:80%;"></div>
                <div class="skeleton-line" style="height:32px;width:60%;"></div>
                <div class="skeleton-line" style="height:13px;width:55%;margin-top:4px;"></div>
                <div class="skeleton-line" style="height:38px;width:140px;border-radius:4px;margin-top:8px;"></div>
            </div>
        </div>
    `;
    try {
        const response = await fetch(`${API}/eventos/filtrar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idTipo, ESTADO: 'DESTACADO' })
        });

        if (response.status === 204) {
            contenedorSkel.style.display = 'none';
            return;
        }

        const lista = (await response.json()).filter(a => a.estado === 'DESTACADO');
        if (lista.length === 0) {
            contenedorSkel.style.display = 'none';
            return;
        }

        // Restaurar estructura del carrusel
        contenedorSkel.innerHTML = `
            <div class="destacados-track" id="destacadosTrack"></div>
            <button class="destacados-btn destacados-prev" id="destacadosPrev">‹</button>
            <button class="destacados-btn destacados-next" id="destacadosNext">›</button>
            <div class="destacados-dots" id="destacadosDots"></div>
        `;

        const contenedor = document.getElementById('destacadosContenedor');
        const track      = document.getElementById('destacadosTrack');
        const dots       = document.getElementById('destacadosDots');

        lista.forEach((a, i) => {
            track.innerHTML += `
                <div class="destacado-slide">
                    <img src="${a.rutaFoto}" onerror="this.style.display='none'">
                    <div class="destacado-overlay">
                        <span class="destacado-etiqueta">Destacado</span>
                        <h3 class="destacado-nombre">${a.nombre}</h3>
                        <div class="destacado-meta">
                            <span>📍 ${a.localizacion}</span>
                            <span>📅 ${a.fechaInicio ? new Date(a.fechaInicio).toLocaleDateString('es-ES') : ''}</span>
                            <span>${a.precio}€</span>
                        </div>
                        <a href="reservarEvento.html?id=${a.idEvento}" class="destacado-btn-reservar">Reservar</a>
                    </div>
                </div>
            `;
            dots.innerHTML += `<span class="destacado-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`;
        });

        let actual = 0;

        function irA(index) {
            actual = (index + lista.length) % lista.length;
            track.style.transform = `translateX(-${actual * 100}%)`;
            document.querySelectorAll('.destacado-dot').forEach((d, i) => {
                d.classList.toggle('active', i === actual);
            });
        }

        document.getElementById('destacadosPrev').addEventListener('click', () => irA(actual - 1));
        document.getElementById('destacadosNext').addEventListener('click', () => irA(actual + 1));
        document.querySelectorAll('.destacado-dot').forEach(d => {
            d.addEventListener('click', () => irA(parseInt(d.dataset.index)));
        });

        let autoplay = setInterval(() => irA(actual + 1), 3000);
        contenedor.addEventListener('mouseenter', () => clearInterval(autoplay));
        contenedor.addEventListener('mouseleave', () => {
            autoplay = setInterval(() => irA(actual + 1), 3000);
        });

    } catch (error) {
        console.error('Error cargando destacados:', error);
        contenedorSkel.style.display = 'none';
    }
}

/* ── Panel de filtros móvil ───────────────────────── */
var btnAbrir   = document.getElementById('btnAbrirFiltros');
var btnCerrar  = document.getElementById('btnCerrarFiltros');
var overlay    = document.getElementById('filtrosOverlay');
var panel      = document.getElementById('filtrosPanel');

function abrirPanel() {
    if (!panel || !overlay) return;
    panel.classList.add('abierto');
    overlay.classList.add('activo');
    document.body.style.overflow = 'hidden';
}

function cerrarPanel() {
    if (!panel || !overlay) return;
    panel.classList.remove('abierto');
    overlay.classList.remove('activo');
    document.body.style.overflow = '';
}

if (btnAbrir)  btnAbrir.addEventListener('click', abrirPanel);
if (btnCerrar) btnCerrar.addEventListener('click', cerrarPanel);
if (overlay)   overlay.addEventListener('click', cerrarPanel);

/* ── Init ─────────────────────────────────────────── */
cargarActividades();
cargarDestacados();