const usuarioProveedor = JSON.parse(sessionStorage.getItem('usuario'));

if (!usuarioProveedor) {
    window.location.href = 'acceso.html';
} else if (usuarioProveedor.perfil?.idPerfil !== 3) {
    window.location.href = usuarioProveedor.perfil?.idPerfil === 1
        ? 'indexAdmn.html'
        : 'index.html';
}

function seleccionarChip(btn, grupo) {
    const contenedor = btn.closest('.form-chips');
    contenedor.querySelectorAll('.form-chip').forEach(c => c.classList.remove('activo'));
    btn.classList.add('activo');
    document.getElementById(grupo).value = btn.dataset.value;
}

function previewFoto(input) {
    const area      = document.getElementById('uploadArea');
    const preview   = document.getElementById('uploadPreview');
    const quitarBtn = document.getElementById('uploadQuitar');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.src = e.target.result;
            area.classList.add('tiene-imagen');
            quitarBtn.classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function quitarFoto(event) {
    event.stopPropagation();
    const area      = document.getElementById('uploadArea');
    const preview   = document.getElementById('uploadPreview');
    const quitarBtn = document.getElementById('uploadQuitar');
    const input     = document.getElementById('foto');

    preview.src = '';
    input.value = '';
    area.classList.remove('tiene-imagen');
    quitarBtn.classList.add('hidden');
}

(function initDragDrop() {
    const area = document.getElementById('uploadArea');
    if (!area) return;

    area.addEventListener('dragover', (e) => {
        e.preventDefault();
        area.style.borderColor = 'var(--rojo)';
    });

    area.addEventListener('dragleave', () => {
        area.style.borderColor = '';
    });

    area.addEventListener('drop', (e) => {
        e.preventDefault();
        area.style.borderColor = '';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const input = document.getElementById('foto');
            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;
            previewFoto(input);
        }
    });
})();


function validarFormulario() {
    const campos = [
        { id: 'nombre',       label: 'Nombre del evento' },
        { id: 'descripcion',  label: 'Descripción' },
        { id: 'fechaInicio',  label: 'Fecha de inicio' },
        { id: 'fechaFin',     label: 'Fecha de fin' },
        { id: 'localizacion', label: 'Localización' },
        { id: 'aforoMaximo',  label: 'Aforo máximo' },
        { id: 'precio',       label: 'Precio' },
        { id: 'idTipo',       label: 'Tipo de evento' },
        { id: 'categoria',    label: 'Categoría' },
        { id: 'extremidad',   label: 'Dificultad' },
    ];

    for (const campo of campos) {
        const el = document.getElementById(campo.id);
        if (!el || !el.value.toString().trim()) {
            return `El campo "${campo.label}" es obligatorio.`;
        }
    }

    const fotoInput = document.getElementById('foto');
    if (!fotoInput.files || fotoInput.files.length === 0) {
        return 'Debes subir una foto del evento.';
    }

    const inicio = new Date(document.getElementById('fechaInicio').value);
    const fin    = new Date(document.getElementById('fechaFin').value);
    if (fin <= inicio) {
        return 'La fecha de fin debe ser posterior a la fecha de inicio.';
    }

    return null;
}


async function enviarEvento() {
    const error = validarFormulario();
    if (error) {
        mostrarResultado(error, 'error');
        return;
    }

    const btn     = document.getElementById('btnPublicar');
    const btnText = document.getElementById('btnPublicarTexto');

    btn.disabled = true;
    btn.classList.add('cargando');
    btnText.innerHTML = '<span class="spinner"></span> Publicando...';

    const formData = new FormData();
    formData.append('nombre',       document.getElementById('nombre').value.trim());
    formData.append('descripcion',  document.getElementById('descripcion').value.trim());
    formData.append('fechaInicio',  document.getElementById('fechaInicio').value);
    formData.append('fechaFin',     document.getElementById('fechaFin').value);
    formData.append('localizacion', document.getElementById('localizacion').value.trim());
    formData.append('aforoMaximo',  document.getElementById('aforoMaximo').value);
    formData.append('precio',       document.getElementById('precio').value);
    formData.append('idTipo',       document.getElementById('idTipo').value);
    formData.append('estado',       document.getElementById('estado').value); 
    formData.append('categoria',    document.getElementById('categoria').value);
    formData.append('extremidad',   document.getElementById('extremidad').value);
    formData.append('foto',         document.getElementById('foto').files[0]);

    try {
        const response = await fetch(`${API}/eventos/crearEvento`, {
            method: 'POST',
            body: formData
        });

        if (response.status === 201 || response.ok) {
            mostrarResultado('✓ ¡Evento publicado correctamente! Será revisado por el administrador antes de aparecer en la plataforma.', 'exito');
            resetFormulario();
        } else {
            const msg = await response.text();
            mostrarResultado(`Error al publicar el evento: ${msg || response.statusText}`, 'error');
        }

    } catch (err) {
        mostrarResultado('No se pudo conectar con el servidor. Inténtalo de nuevo.', 'error');
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.classList.remove('cargando');
        btnText.textContent = 'Publicar evento';
    }
}


function mostrarResultado(texto, tipo) {
    const el = document.getElementById('formResultado');
    el.textContent = texto;
    el.className = `form-resultado ${tipo}`;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetFormulario() {
    ['nombre', 'descripcion', 'fechaInicio', 'fechaFin', 'localizacion', 'aforoMaximo', 'precio'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('idTipo').value = '';
    ['categoria', 'extremidad'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.querySelectorAll('.form-chip').forEach(c => c.classList.remove('activo'));
    const fakeEvent = { stopPropagation: () => {} };
    quitarFoto(fakeEvent);
}