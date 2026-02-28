const apiBaseUrl = 'http://localhost:3001';


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

