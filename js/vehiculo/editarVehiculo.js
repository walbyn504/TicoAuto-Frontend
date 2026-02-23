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

    if (vehiculo.marca === '' || vehiculo.modelo === '') {
        return false;
    }

    if (isNaN(vehiculo.anno) || vehiculo.anno <= 0) {
        return false;
    }

    if (isNaN(vehiculo.precio) || vehiculo.precio <= 0) {
        return false;
    }

    return true;
}


async function editarVehiculo(id) {

    const vehiculo = obtenerDatosFormulario();

    if (!validarVehiculo(vehiculo)) {
        alert("Complete todos los campos correctamente ❌");
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

