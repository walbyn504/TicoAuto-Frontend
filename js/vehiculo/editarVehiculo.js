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




