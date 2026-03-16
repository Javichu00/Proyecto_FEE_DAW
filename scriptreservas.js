/* ============================================
   scriptReservas.js — SportsXtreme
   Gestión completa de reservas
   ============================================ */

// ── DATOS DE EJEMPLO ─────────────────────────
// En producción esto vendría de tu API/backend
let reservas = JSON.parse(localStorage.getItem('sx_reservas')) || [
    {
        id: 'SX-00412',
        tipo: 'actividad',
        nombre: 'Salto en Paracaídas',
        descripcion: 'Lánzate desde 4.000 metros de altitud con instructor certificado. Caída libre de 60 segundos y planeo de 5 minutos.',
        fecha: '2026-03-22',
        hora: '09:00',
        lugar: 'Aeródromo de Ocaña',
        personas: 2,
        precioPorPersona: 199,
        precioTotal: 398,
        estado: 'confirmada',  // confirmada | pendiente | completada | cancelada
        pagado: true,
        valoracion: null
    },
    {
        id: 'SX-00438',
        tipo: 'curso',
        nombre: 'Buceo Open Water',
        descripcion: 'Curso oficial PADI Open Water Diver. De la piscina al mar abierto. Certificación internacional incluida. 5 días intensivos.',
        fecha: '2026-04-05',
        hora: '08:30',
        lugar: 'Puerto de Alicante',
        personas: 1,
        precioPorPersona: 350,
        precioTotal: 350,
        estado: 'pendiente',
        pagado: false,
        expiraEn: '48h',
        valoracion: null
    },
    {
        id: 'SX-00391',
        tipo: 'show',
        nombre: 'Monster Trucks Night Show',
        descripcion: 'Espectáculo nocturno de monster trucks con saltos, pirotecnia y música en directo.',
        fecha: '2026-03-15',
        hora: '21:00',
        lugar: 'Recinto Ferial IFEMA',
        personas: 3,
        precioPorPersona: 45,
        precioTotal: 135,
        estado: 'confirmada',
        pagado: true,
        valoracion: null
    },
    {
        id: 'SX-00348',
        tipo: 'actividad',
        nombre: 'Rafting en Aguas Bravas',
        descripcion: 'Navegaste por rápidos de nivel III-IV con guía experto en el río Noguera Pallaresa.',
        fecha: '2026-02-01',
        hora: '10:00',
        lugar: 'Noguera Pallaresa, Lleida',
        personas: 4,
        precioPorPersona: 75,
        precioTotal: 300,
        estado: 'completada',
        pagado: true,
        valoracion: null
    }
];

function guardar() {
    localStorage.setItem('sx_reservas', JSON.stringify(reservas));
}

// ── HELPERS ───────────────────────────────────
const hoy = new Date();
hoy.setHours(0, 0, 0, 0);

function esFutura(r) {
    return new Date(r.fecha) >= hoy;
}

function formatFecha(fechaStr) {
    const d = new Date(fechaStr + 'T00:00:00');
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function diasRestantes(fechaStr) {
    const d = new Date(fechaStr + 'T00:00:00');
    const diff = Math.ceil((d - hoy) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Hoy';
    if (diff === 1) return 'Mañana';
    if (diff < 0) return `Hace ${Math.abs(diff)} días`;
    return `En ${diff} días`;
}

function estrellasHtml(val) {
    let h = '';
    for (let i = 1; i <= 5; i++) h += `<span style="color:${i <= val ? '#fbbf24' : '#444'}">★</span>`;
    return h;
}

// ── RENDER ────────────────────────────────────
function renderTarjeta(r) {
    const esCompleta  = r.estado === 'completada';
    const esPendiente = r.estado === 'pendiente';
    const esFut       = esFutura(r);

    const desglose = r.personas > 1
        ? `${r.personas} × ${r.precioPorPersona}€/ud`
        : `${r.precioPorPersona}€ / persona`;

    const estadoLabel = {
        confirmada: 'Confirmada',
        pendiente: 'Pago pendiente',
        completada: 'Completada',
        cancelada: 'Cancelada'
    }[r.estado] || r.estado;

    let accionesHtml = '';

    if (!esCompleta && !esPendiente) {
        accionesHtml += `<button class="btn-accion secundario" onclick="verEntradas('${r.id}')">
            <span>🎫</span> Ver entradas
        </button>`;
    }

    if (esPendiente) {
        accionesHtml += `<button class="btn-accion primario" onclick="pagarAhora('${r.id}')">
            <span>💳</span> Pagar ahora
        </button>`;
    }

    if (!esCompleta && esFut) {
        accionesHtml += `<button class="btn-accion peligro" onclick="abrirModalCancelar('${r.id}')">
            <span>✕</span> Cancelar
        </button>`;
    }

    if (esCompleta) {
        if (r.valoracion) {
            accionesHtml += `
                <div class="card-valoracion">
                    <span class="estrellas-val">${estrellasHtml(r.valoracion)}</span>
                    <span>Tu valoración</span>
                </div>
                <button class="btn-accion secundario" onclick="repetirReserva('${r.id}')">
                    <span>🔁</span> Repetir
                </button>`;
        } else {
            accionesHtml += `
                <button class="btn-accion verde" onclick="abrirModalValorar('${r.id}')">
                    <span>⭐</span> Valorar
                </button>
                <button class="btn-accion secundario" onclick="repetirReserva('${r.id}')">
                    <span>🔁</span> Repetir
                </button>`;
        }
    }

    return `
    <div class="reserva-card" id="card-${r.id}">
        <div class="card-stripe ${r.tipo}"></div>
        <div class="card-body">
            <div class="card-head">
                <div>
                    <div class="card-badges" style="margin-bottom:8px">
                        <span class="card-tipo-badge ${r.tipo}">${r.tipo.toUpperCase()}</span>
                        <span class="card-estado-badge ${r.estado}">${estadoLabel}</span>
                        ${esFut && r.estado === 'confirmada' ? `<span style="font-size:0.72rem;color:#888;font-weight:600">${diasRestantes(r.fecha)}</span>` : ''}
                    </div>
                    <div class="card-nombre">${r.nombre}</div>
                </div>
            </div>

            <div class="card-meta">
                <span class="card-meta-item"><span class="meta-icon">📅</span> ${formatFecha(r.fecha)} · ${r.hora}h</span>
                <span class="card-meta-item"><span class="meta-icon">📍</span> ${r.lugar}</span>
                <span class="card-meta-item"><span class="meta-icon">👥</span> ${r.personas} persona${r.personas > 1 ? 's' : ''}</span>
            </div>

            ${esPendiente ? `<div><span class="card-expira">⏳ Reserva expira en ${r.expiraEn || '48h'} — Completa el pago</span></div>` : ''}

            <div class="card-precio-row">
                <div>
                    <div class="card-precio-total">${r.precioTotal}€ <span>${r.pagado ? 'total pagado' : 'pendiente de pago'}</span></div>
                    <div class="card-precio-desglose">${desglose}</div>
                </div>
                <div class="card-ref">REF #${r.id}</div>
            </div>

            <div class="card-acciones">
                ${accionesHtml}
            </div>
        </div>
    </div>`;
}

function renderLista(lista, contenedorId, emptyId) {
    const contenedor = document.getElementById(contenedorId);
    const empty      = document.getElementById(emptyId);
    if (!lista.length) {
        contenedor.innerHTML = '';
        empty.classList.remove('hidden');
    } else {
        empty.classList.add('hidden');
        contenedor.innerHTML = lista.map(renderTarjeta).join('');
    }
}

function renderStats() {
    const confirmadas = reservas.filter(r => r.estado === 'confirmada').length;
    const pendientes  = reservas.filter(r => r.estado === 'pendiente').length;
    const total       = reservas.reduce((s, r) => r.pagado ? s + r.precioTotal : s, 0);

    document.getElementById('reservasStats').innerHTML = `
        <div class="stat-item"><div class="stat-num">${confirmadas}</div><div class="stat-label">Confirmadas</div></div>
        <div class="stat-item"><div class="stat-num" style="color:var(--amarillo)">${pendientes}</div><div class="stat-label">Pendientes</div></div>
        <div class="stat-item"><div class="stat-num">${total}€</div><div class="stat-label">Total invertido</div></div>
    `;
}

function renderTodo() {
    const proximas   = reservas.filter(r => r.estado === 'confirmada' && esFutura(r));
    const pendientes = reservas.filter(r => r.estado === 'pendiente');
    const historial  = reservas.filter(r => r.estado === 'completada' || (r.estado === 'confirmada' && !esFutura(r)));

    renderLista(proximas,   'lista-proximas',  'empty-proximas');
    renderLista(pendientes, 'lista-pendientes','empty-pendientes');
    renderLista(historial,  'lista-historial', 'empty-historial');

    document.getElementById('badge-proximas').textContent   = proximas.length;
    document.getElementById('badge-pendientes').textContent = pendientes.length;
    document.getElementById('badge-historial').textContent  = historial.length;

    renderStats();
}

// ── TABS ──────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
    });
});

// ── ACCIONES ──────────────────────────────────
function verEntradas(id) {
    mostrarToast('🎫 Abriendo entradas de #' + id + '…');
}

function pagarAhora(id) {
    const r = reservas.find(x => x.id === id);
    if (!r) return;
    // Simula pago completado
    r.estado  = 'confirmada';
    r.pagado  = true;
    guardar();
    renderTodo();
    mostrarToast('💳 Pago completado para ' + r.nombre, 'verde');
}

// ── MODAL CANCELAR ────────────────────────────
let idCancelar = null;

function abrirModalCancelar(id) {
    idCancelar = id;
    const r = reservas.find(x => x.id === id);
    document.getElementById('modalNombre').textContent = r ? r.nombre : id;
    document.getElementById('modalCancelar').classList.remove('hidden');
}

document.getElementById('btnModalNo').addEventListener('click', () => {
    document.getElementById('modalCancelar').classList.add('hidden');
    idCancelar = null;
});

document.getElementById('btnModalSi').addEventListener('click', () => {
    if (!idCancelar) return;
    reservas = reservas.filter(r => r.id !== idCancelar);
    guardar();
    renderTodo();
    document.getElementById('modalCancelar').classList.add('hidden');
    mostrarToast('✕ Reserva cancelada', 'peligro');
    idCancelar = null;
});

// Cerrar modal al clicar fondo
document.getElementById('modalCancelar').addEventListener('click', function(e) {
    if (e.target === this) {
        this.classList.add('hidden');
        idCancelar = null;
    }
});

// ── MODAL VALORAR ────────────────────────────
let idValorar   = null;
let valorActual = 0;

function abrirModalValorar(id) {
    idValorar   = id;
    valorActual = 0;
    const r = reservas.find(x => x.id === id);
    document.getElementById('modalValorarNombre').textContent = r ? r.nombre : '';
    document.getElementById('comentarioValoracion').value = '';
    actualizarEstrellas(0);
    document.getElementById('modalValorar').classList.remove('hidden');
}

function actualizarEstrellas(val) {
    document.querySelectorAll('.estrella').forEach(e => {
        e.classList.toggle('activa', parseInt(e.dataset.val) <= val);
    });
}

document.querySelectorAll('.estrella').forEach(e => {
    e.addEventListener('click', () => {
        valorActual = parseInt(e.dataset.val);
        actualizarEstrellas(valorActual);
    });
    e.addEventListener('mouseenter', () => actualizarEstrellas(parseInt(e.dataset.val)));
    e.addEventListener('mouseleave', () => actualizarEstrellas(valorActual));
});

document.getElementById('btnValorarNo').addEventListener('click', () => {
    document.getElementById('modalValorar').classList.add('hidden');
    idValorar = null;
});

document.getElementById('btnValorarSi').addEventListener('click', () => {
    if (!idValorar || valorActual === 0) {
        mostrarToast('⚠️ Selecciona al menos una estrella', 'amarillo');
        return;
    }
    const r = reservas.find(x => x.id === idValorar);
    if (r) r.valoracion = valorActual;
    guardar();
    renderTodo();
    document.getElementById('modalValorar').classList.add('hidden');
    mostrarToast('⭐ ¡Gracias por tu valoración!', 'verde');
    idValorar = null;
});

document.getElementById('modalValorar').addEventListener('click', function(e) {
    if (e.target === this) { this.classList.add('hidden'); idValorar = null; }
});

// ── REPETIR ───────────────────────────────────
function repetirReserva(id) {
    const r = reservas.find(x => x.id === id);
    if (!r) return;
    mostrarToast('🔁 Redirigiendo a ' + r.nombre + '…');
    // En producción: window.location.href = 'detalle.html?id=...';
}

// ── TOAST ─────────────────────────────────────
let toastTimer = null;

function mostrarToast(msg, tipo = '') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast' + (tipo ? ' ' + tipo : '');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.classList.add('hidden'); }, 3200);
}

// ── INIT ──────────────────────────────────────
renderTodo();