const apiBaseUrl = 'http://localhost:3001';


function obtenerDatosFormulario() {
    return {
        marca: document.getElementById('marca').value.trim(),
        modelo: document.getElementById('modelo').value.trim(),
        anno: parseInt(document.getElementById('anno').value),
        precio: parseFloat(document.getElementById('precio').value)
    };
}


function validarVehiculo(vehiculo) {

    if (vehiculo.marca === '') {
        return "La marca es obligatoria";
    }

    if (vehiculo.modelo === '') {
        return "El modelo es obligatorio";
    }

    if (isNaN(vehiculo.anno) || vehiculo.anno <= 0) {
        return "El año debe ser un número valido mayor a 0";
    }

    if (isNaN(vehiculo.precio) || vehiculo.precio <= 0) {
        return "El precio debe ser un número valido mayor a 0";
    }

    return null; // No hay errores
}


async function editarVehiculo(id) {

    const vehiculo = obtenerDatosFormulario();
    const validacion = validarVehiculo(vehiculo);

    if (validacion) {
        alert(validacion + " ❌");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehiculo)
        });

        if (response.status === 200) {
            alert("Vehículo actualizado correctamente ✅");
            location.reload();
        } else {
            alert("Error al actualizar ❌");
        }

    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
}

