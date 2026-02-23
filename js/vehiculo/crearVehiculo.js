const apiBaseUrl = 'http://localhost:3001';

async function createVehiculo() {
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const anno = parseInt(document.getElementById('anno').value);
    const precio = parseFloat(document.getElementById('precio').value);

    // Validación básica de campos 
    if (!marca || !modelo || !anno || !precio) {
        alert('Complete todos los campos correctamente');
        return;
    }

    const vehiculo = { 
        marca, 
        modelo, 
        anno, 
        precio };

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