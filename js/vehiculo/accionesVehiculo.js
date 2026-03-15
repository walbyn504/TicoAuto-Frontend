

function verDetalles(id) {
    location.href = `html/vehiculo/verInfoVehiculo.html?id=${id}`;
}

function copiarEnlace(id) {
    try {
        const enlace = `${window.location.origin}/html/vehiculo/verInfoVehiculo.html?id=${id}`;
        navigator.clipboard.writeText(enlace);
        alert("Enlace copiado al portapapeles ✅");
    } catch (error) {
        alert("No se pudo copiar el enlace ❌");
        console.error(error);
    }
}

function abrirPaginaPregunta(vehiculoId){
    window.location.href = `/html/conversacion/conversacion.html?vehiculoId=${vehiculoId}`;
}