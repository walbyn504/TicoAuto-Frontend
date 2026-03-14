const apiBaseUrl = "http://localhost:3001";
const token = sessionStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const vehiculoIdUrl = params.get("vehiculoId");

//Variables globales
let conversacionesAgrupadas = {};
let vehiculoSeleccionado = null;

document.addEventListener("DOMContentLoaded", async () => {
    await cargarConversaciones();
});