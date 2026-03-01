const apiBaseUrl = 'http://localhost:3001';
const form = document.getElementById('formVehiculo');
const token = sessionStorage.getItem('token');

// Función intermedia: decide si crea o edita
async function procesarVehiculo() {
    const id = sessionStorage.getItem('vehiculoId');

    if (id) {
        // EDITAR
        const res = await fetch(`${apiBaseUrl}/api/vehiculo/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const vehiculo = await res.json();
        cargarVehiculo(vehiculo);
    }
}

function cargarVehiculo(vehiculo) {
    document.getElementById('vehiculoId').value = vehiculo._id;
    document.getElementById('marca').value = vehiculo.marca;
    document.getElementById('modelo').value = vehiculo.modelo;
    document.getElementById('anno').value = vehiculo.anno;
    document.getElementById('precio').value = vehiculo.precio;

    // Mostrar la imagen existente
    const preview = document.getElementById('vistaPrevia');
    preview.src = `${apiBaseUrl}/imagenes/${vehiculo.imagen}`;
    preview.style.display = 'block';
}

// Ejecutar al cargar
window.onload = procesarVehiculo;

// Evento submit
form.addEventListener('submit', async e => {
    e.preventDefault();

    const id = document.getElementById('vehiculoId').value;
    const marca = document.getElementById('marca').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const anno = parseInt(document.getElementById('anno').value);
    const precio = parseFloat(document.getElementById('precio').value);
    const imagen = document.getElementById('imagen').files[0];

    if (!marca || !modelo || isNaN(anno) || isNaN(precio)) {
        alert("Complete todos los campos ❌");
        return;
    }

    const formData = new FormData();
    formData.append('marca', marca);
    formData.append('modelo', modelo);
    formData.append('anno', anno);
    formData.append('precio', precio);
    if (imagen) formData.append('imagen', imagen);

    try {
        const response = await fetch(
            id ? `${apiBaseUrl}/api/vehiculo/${id}` : `${apiBaseUrl}/api/vehiculo`,
            {
                method: id ? 'PUT' : 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            }
        );
        if (response.ok) {
            alert(id ? "Vehículo actualizado ✅" : "Vehículo creado ✅");
            sessionStorage.removeItem('vehiculoId');
            location.href = '../../index.html';
        } else {
            alert("Error al guardar ❌");
        }
    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
});