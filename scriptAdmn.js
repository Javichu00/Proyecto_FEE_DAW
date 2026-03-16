let tablaActual = 'eventos';
let datosEventos = [];
let datosUsuarios = [];
let datosReservas = [];

// ─────────────────────────────────────────
// CARGA INICIAL
// ─────────────────────────────────────────
async function cargarDatos() {
    await Promise.all([
        cargarEventos(),
        cargarUsuarios(),
        cargarReservas()
    ]);
}

async function cargarEventos() {
    try {
        const res = await fetch(`${API}/eventos`);
        if (res.ok) {
            datosEventos = await res.json();
            renderEventos(datosEventos);
        }
    } catch (e) { console.error('Error eventos:', e); }
}

async function cargarUsuarios() {
    try {
        const res = await fetch(`${API}/usuarios`);
        if (res.ok) {
            datosUsuarios = await res.json();
            renderUsuarios(datosUsuarios);
        }
    } catch (e) { console.error('Error usuarios:', e); }
}

async function cargarReservas() {
    try {
        const res = await fetch(`${API}/reservas`);
        if (res.ok) {
            datosReservas = await res.json();
            renderReservas(datosReservas);
        }
    } catch (e) { console.error('Error reservas:', e); }
}

// ─────────────────────────────────────────
// TABS
// ─────────────────────────────────────────
function cambiarTabla(tabla) {
    tablaActual = tabla;
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.admin-tabla-wrapper').forEach(t => t.classList.add('hidden'));
    document.getElementById(`tabla-${tabla}`).classList.remove('hidden');
    document.getElementById('admin-buscador').value = '';
}

// ─────────────────────────────────────────
// BUSCADOR
// ─────────────────────────────────────────
function filtrarTabla() {
    const q = document.getElementById('admin-buscador').value.toLowerCase();
    if (tablaActual === 'eventos') {
        renderEventos(datosEventos.filter(e =>
            e.nombre.toLowerCase().includes(q) ||
            e.localizacion?.toLowerCase().includes(q)
        ));
    } else if (tablaActual === 'usuarios') {
        renderUsuarios(datosUsuarios.filter(u =>
            u.nombreCompleto?.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        ));
    } else {
        renderReservas(datosReservas.filter(r =>
            r.usuario?.nombreCompleto?.toLowerCase().includes(q) ||
            r.evento?.nombre?.toLowerCase().includes(q)
        ));
    }
}

// ─────────────────────────────────────────
// RENDER EVENTOS
// ─────────────────────────────────────────
function renderEventos(lista) {
    const tbody = document.getElementById('tbody-eventos');
    tbody.innerHTML = '';
    lista.forEach(e => {
        const tr = document.createElement('tr');
        tr.id = `ev-${e.idEvento}`;
        tr.innerHTML = `
            <td>${e.idEvento}</td>
            <td><img src="${e.rutaFoto}" style="width:60px;height:40px;object-fit:cover;border-radius:4px;"
                 onerror="this.style.display='none'"></td>
            <td>${e.tipo?.nombre || ''}</td>
            <td class="celda-editable" data-campo="nombre" data-id="${e.idEvento}" data-tabla="eventos">${e.nombre}</td>
            <td class="celda-editable" data-campo="descripcion" data-id="${e.idEvento}" data-tabla="eventos"
                style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${e.descripcion}</td>
            <td class="celda-editable" data-campo="fechaInicio" data-id="${e.idEvento}" data-tabla="eventos">${e.fechaInicio || ''}</td>
            <td class="celda-editable" data-campo="fechaFin" data-id="${e.idEvento}" data-tabla="eventos">${e.fechaFin || ''}</td>
            <td class="celda-editable" data-campo="localizacion" data-id="${e.idEvento}" data-tabla="eventos">${e.localizacion || ''}</td>
            <td class="celda-editable" data-campo="aforoMaximo" data-id="${e.idEvento}" data-tabla="eventos">${e.aforoMaximo}</td>
            <td class="celda-editable" data-campo="estado" data-id="${e.idEvento}" data-tabla="eventos">${e.estado}</td>
            <td class="celda-editable" data-campo="precio" data-id="${e.idEvento}" data-tabla="eventos">${e.precio}</td>
            <td class="celda-editable" data-campo="categoria" data-id="${e.idEvento}" data-tabla="eventos">${e.categoria}</td>
            <td class="celda-editable" data-campo="extremidad" data-id="${e.idEvento}" data-tabla="eventos">${e.extremidad}</td>
            <td>
                <button class="btn-editar-fila" onclick="editarFila('ev-${e.idEvento}', 'eventos', ${e.idEvento})">Editar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─────────────────────────────────────────
// RENDER USUARIOS
// ─────────────────────────────────────────
function renderUsuarios(lista) {
    const tbody = document.getElementById('tbody-usuarios');
    tbody.innerHTML = '';
    lista.forEach(u => {
        const tr = document.createElement('tr');
        tr.id = `us-${u.idUsuario}`;
        tr.innerHTML = `
            <td>${u.idUsuario}</td>
            <td class="celda-editable" data-campo="nombreCompleto" data-id="${u.idUsuario}" data-tabla="usuarios">${u.nombreCompleto || ''}</td>
            <td class="celda-editable" data-campo="email" data-id="${u.idUsuario}" data-tabla="usuarios">${u.email}</td>
            <td class="celda-editable" data-campo="password" data-id="${u.idUsuario}" data-tabla="usuarios">${u.password}</td>
            <td class="celda-editable" data-campo="enabled" data-id="${u.idUsuario}" data-tabla="usuarios">${u.enabled}</td>
            <td>${u.fechaRegistro || ''}</td>
            <td>${u.perfil?.nombre || ''}</td>
            <td>
                <button class="btn-editar-fila" onclick="editarFila('us-${u.idUsuario}', 'usuarios', ${u.idUsuario})">Editar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─────────────────────────────────────────
// RENDER RESERVAS
// ─────────────────────────────────────────
function renderReservas(lista) {
    const tbody = document.getElementById('tbody-reservas');
    tbody.innerHTML = '';
    lista.forEach(r => {
        const tr = document.createElement('tr');
        tr.id = `res-${r.idReserva}`;
        tr.innerHTML = `
            <td>${r.idReserva}</td>
            <td>${r.usuario?.idUsuario} — ${r.usuario?.nombreCompleto || ''}</td>
            <td>
                <img src="${r.evento?.rutaFoto}" style="width:40px;height:30px;object-fit:cover;border-radius:3px;vertical-align:middle;margin-right:6px;"
                     onerror="this.style.display='none'">
                ${r.evento?.idEvento} — ${r.evento?.nombre || ''}
            </td>
            <td class="celda-editable" data-campo="precioVenta" data-id="${r.idReserva}" data-tabla="reservas">${r.precioVenta}</td>
            <td class="celda-editable" data-campo="cantidad" data-id="${r.idReserva}" data-tabla="reservas">${r.cantidad}</td>
            <td class="celda-editable" data-campo="observaciones" data-id="${r.idReserva}" data-tabla="reservas">${r.observaciones || ''}</td>
            <td>
                <button class="btn-editar-fila" onclick="editarFila('res-${r.idReserva}', 'reservas', ${r.idReserva})">Editar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─────────────────────────────────────────
// EDITAR FILA
// ─────────────────────────────────────────
function editarFila(trId, tabla, id) {
    const tr = document.getElementById(trId);
    const btn = tr.querySelector('.btn-editar-fila');
    const editando = tr.classList.contains('editando');

    if (!editando) {
        // Activar edición — convertir celdas editables en inputs
        tr.classList.add('editando');
        btn.textContent = 'Guardar';
        btn.classList.add('guardar');

        tr.querySelectorAll('.celda-editable').forEach(td => {
            const valor = td.textContent.trim();
            const campo = td.dataset.campo;

            // Campos con opciones fijas → select
            if (campo === 'estado') {
                td.innerHTML = `<select class="input-celda">
                    <option ${valor==='ACTIVO'?'selected':''}>ACTIVO</option>
                    <option ${valor==='TERMINADO'?'selected':''}>TERMINADO</option>
                    <option ${valor==='CANCELADO'?'selected':''}>CANCELADO</option>
                </select>`;
            } else if (campo === 'categoria') {
                td.innerHTML = `<select class="input-celda">
                    <option ${valor==='AIRE'?'selected':''}>AIRE</option>
                    <option ${valor==='MAR'?'selected':''}>MAR</option>
                    <option ${valor==='TIERRA'?'selected':''}>TIERRA</option>
                </select>`;
            } else if (campo === 'extremidad') {
                td.innerHTML = `<select class="input-celda">
                    <option ${valor==='SUAVE'?'selected':''}>SUAVE</option>
                    <option ${valor==='MEDIO'?'selected':''}>MEDIO</option>
                    <option ${valor==='DURO'?'selected':''}>DURO</option>
                    <option ${valor==='EXTREMO'?'selected':''}>EXTREMO</option>
                </select>`;
            } else if (campo === 'enabled') {
                td.innerHTML = `<select class="input-celda">
                    <option ${valor==='1'?'selected':''} value="1">Activo</option>
                    <option ${valor==='0'?'selected':''} value="0">Inactivo</option>
                </select>`;
            } else {
                td.innerHTML = `<input class="input-celda" type="text" value="${valor}">`;
            }
        });

    } else {
        // Guardar
        guardarFila(trId, tabla, id);
    }
}

// ─────────────────────────────────────────
// GUARDAR FILA
// ─────────────────────────────────────────
async function guardarFila(trId, tabla, id) {
    const tr = document.getElementById(trId);
    const btn = tr.querySelector('.btn-editar-fila');

    // Recoge los valores editados
    const datos = {};
    tr.querySelectorAll('.celda-editable').forEach(td => {
        const campo = td.dataset.campo;
        const input = td.querySelector('input, select');
        datos[campo] = input ? input.value : td.textContent.trim();
    });

    // Construye el objeto completo según la tabla
    let body = {};
    let url = '';
    let objeto = {};

    if (tabla === 'eventos') {
        objeto = datosEventos.find(e => e.idEvento === id);
        body = { ...objeto, ...datos, aforoMaximo: parseInt(datos.aforoMaximo), precio: parseFloat(datos.precio) };
        url = `${API}/eventos`;
    } else if (tabla === 'usuarios') {
        objeto = datosUsuarios.find(u => u.idUsuario === id);
        body = { ...objeto, ...datos, enabled: parseInt(datos.enabled) };
        url = `${API}/usuarios`;
    } else if (tabla === 'reservas') {
        objeto = datosReservas.find(r => r.idReserva === id);
        body = { ...objeto, ...datos, cantidad: parseInt(datos.cantidad), precioVenta: parseFloat(datos.precioVenta) };
        url = `${API}/reservas`;
    }

    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (res.ok) {
            // Actualiza los datos locales
            if (tabla === 'eventos') {
                datosEventos = datosEventos.map(e => e.idEvento === id ? body : e);
                await cargarEventos();
            } else if (tabla === 'usuarios') {
                datosUsuarios = datosUsuarios.map(u => u.idUsuario === id ? body : u);
                await cargarUsuarios();
            } else {
                datosReservas = datosReservas.map(r => r.idReserva === id ? body : r);
                await cargarReservas();
            }
        } else {
            alert('Error al guardar');
            // Revierte la fila
            tr.classList.remove('editando');
            btn.textContent = 'Editar';
            btn.classList.remove('guardar');
        }
    } catch (e) {
        console.error(e);
        alert('No se puede conectar con el servidor');
    }
}

// ─────────────────────────────────────────
// INICIO
// ─────────────────────────────────────────
cargarDatos();