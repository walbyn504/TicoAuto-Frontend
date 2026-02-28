const apiBaseUrl = 'http://localhost:3001';

async function createVehiculo() {
    
    const vehiculo = obtenerDatosFormulario();  
    const validacion = validarVehiculo(vehiculo);

    if (validacion) {
        alert(validacion + " ❌");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vehiculo)
        });

        if (response.status === 201) {
            alert("Vehículo creado correctamente ✅");
            location.href = '#';
        } 
        else if (response.status === 400) {
            alert("Datos inválidos ❌");
        }
    } catch (error) {
        alert("No se pudo conectar al servidor");
    }
}