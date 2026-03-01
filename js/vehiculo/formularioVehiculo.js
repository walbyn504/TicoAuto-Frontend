const apiBaseUrl = 'http://localhost:3001';

document.getElementById('formVehiculo').addEventListener('submit', async function(e) {
    e.preventDefault();

    const id = document.getElementById('vehiculoId').value; // Crear o editar
    const token = sessionStorage.getItem('token');

    const marca = document.getElementById('marca').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    const anno = parseInt(document.getElementById('anno').value);
    const precio = parseFloat(document.getElementById('precio').value);
    const imagen = document.getElementById('imagen').files[0]; // Archivo real

    // Validación simple
    if (!marca || !modelo || isNaN(anno) || isNaN(precio)) {
        alert("Complete todos los campos correctamente ❌");
        return;
    }

    // FormData para Multer
    const formData = new FormData();
    formData.append('marca', marca);
    formData.append('modelo', modelo);
    formData.append('anno', anno);
    formData.append('precio', precio);
    if (imagen) formData.append('imagen', imagen); // Solo si hay archivo

    try {
        const response = await fetch(
            id ? `${apiBaseUrl}/api/vehiculo/${id}` : `${apiBaseUrl}/api/vehiculo`,
            {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}` // Token
                },
                body: formData
            }
        );

        if (response.ok) {
            alert(id ? "Vehículo actualizado ✅" : "Vehículo creado ✅");
            location.href = '../../index.html';
        } else if (response.status === 401) {
            alert("No autorizado ❌");
        } else {
            alert("Error al guardar ❌");
        }

    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
});

// Cargar datos para edición
function cargarVehiculo(vehiculo) {
    document.getElementById('vehiculoId').value = vehiculo._id;
    document.getElementById('marca').value = vehiculo.marca;
    document.getElementById('modelo').value = vehiculo.modelo;
    document.getElementById('anno').value = vehiculo.anno;
    document.getElementById('precio').value = vehiculo.precio;
    // Imagen no se carga automáticamente
}