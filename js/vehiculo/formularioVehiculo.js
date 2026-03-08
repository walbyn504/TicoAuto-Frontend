const apiBaseUrl = 'http://localhost:3001';
const token = sessionStorage.getItem('token');

if (!token) {
    alert("Debe iniciar sesión");
    location.href = "/html/usuario/inicioSesion.html";
}


// --- Función principal: inicializa la página ---
async function initVehiculo() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        cargarVehiculo(id);
    }

}

// --- Cargar vehículo para edición ---
async function cargarVehiculo(id) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Error al cargar vehículo");

        const vehiculo = await response.json(); 
        llenarFormulario(vehiculo);
    } catch (error) {
        alert("No se pudo cargar el vehículo ❌");
    }
}

// --- Llenar formulario con los datos del vehículo ---
function llenarFormulario(vehiculo) {
    const form = document.getElementById('formVehiculo');
    form.vehiculoId.value = vehiculo._id;
    form.marca.value = vehiculo.marca;
    form.modelo.value = vehiculo.modelo;
    form.anno.value = vehiculo.anno;
    form.precio.value = vehiculo.precio;
    form.combustible.value = vehiculo.combustible;
    form.color.value = vehiculo.color;
    form.transmision.value = vehiculo.transmision;
    form.condicion.value = vehiculo.condicion;

    if (vehiculo.imagen) {
        const preview = document.getElementById('vistaPrevia');
        preview.src = `${apiBaseUrl}/imagenes/${vehiculo.imagen}`;
        preview.style.display = 'block';
    }
}

// --- Guardar o actualizar vehículo ---
async function guardarVehiculo() {
    const form = document.getElementById('formVehiculo');
    const id = form.vehiculoId.value;
    const marca = form.marca.value.trim();
    const modelo = form.modelo.value.trim();
    const anno = parseInt(form.anno.value);
    const precio = parseFloat(form.precio.value);
    const combustible = form.combustible.value;
    const color = form.color.value.trim();
    const transmision = form.transmision.value;
    const condicion = form.condicion.value;
    const imagen = document.getElementById("imagen").files[0];

    if (!marca || !modelo || isNaN(anno) || isNaN(precio)) {
        return alert("Complete todos los campos ❌");
    }
    
    if (!id && !imagen) {
        return alert("Seleccione una imagen para el vehículo ❌");
    }

    const formData = new FormData();
    formData.append('marca', marca);
    formData.append('modelo', modelo);
    formData.append('anno', anno);
    formData.append('precio', precio);
    formData.append('combustible', combustible);
    formData.append('color', color);
    formData.append('transmision', transmision);
    formData.append('condicion', condicion);
    if (imagen) {
        formData.append('imagen', imagen);
    }

    try {
        const response = await fetch(
            id ? `${apiBaseUrl}/api/vehiculo/${id}` : `${apiBaseUrl}/api/vehiculo`,
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            }
        );

        const data = await response.json();
        if (!response.ok){
            alert(data.message);
            return;
        }

        alert(id ? "Vehículo actualizado ✅" : "Vehículo creado ✅");
        location.href = '../../index.html';
    } catch {
        alert("No se pudo conectar al servidor ❌");
    }
}

// --- Regresar al índice ---
function regresar() {
    location.href = '/html/vehiculo/gestionVehiculo.html';
}

// --- Inicializar al cargar la página ---
initVehiculo();