const apiBaseUrl = 'http://localhost:3001';


function obtenerDatosFormulario() {
    return {
        marca: document.getElementById('marca').value.trim(),
        modelo: document.getElementById('modelo').value.trim(),
        anno: parseInt(document.getElementById('anno').value),
        precio: parseFloat(document.getElementById('precio').value)
    };
}


