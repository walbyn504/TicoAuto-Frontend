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
