const apiBaseUrl = 'http://localhost:3001';
const token = sessionStorage.getItem('token');

// --- Función principal: inicializa la página ---
async function initVehiculo() {
    const id = sessionStorage.getItem('vehiculoId');
    if (id) await cargarVehiculo(id);
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
    const imagen = form.imagen.files[0];

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
        if (!response.ok) throw new Error();

        alert(id ? "Vehículo actualizado ✅" : "Vehículo creado ✅");
        sessionStorage.removeItem('vehiculoId');
        location.href = '../../index.html';
    } catch {
        alert("No se pudo conectar al servidor ❌");
    }
}

// --- Regresar al índice ---
function regresar() {
    sessionStorage.removeItem('vehiculoId');
    location.href = '../../index.html';
}

// --- Inicializar al cargar la página ---
initVehiculo();