const apiBaseUrl = "http://localhost:3001";
const token = sessionStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const vehiculoIdUrl = params.get("vehiculoId");

//Variables globales
let conversacionesAgrupadas = {};
let conversacionSeleccionada = null;
let modoEnvio = "pregunta";
let preguntaPendienteId = null;
let preguntaSinRespuesta = null;
const usuarioLogueadoId = sessionStorage.getItem("usuarioId");
const nombre = sessionStorage.getItem("usuario");

async function enviarMensaje() {
    if (modoEnvio === "pregunta") {
        await enviarPregunta();
        return;
    }

    if (modoEnvio === "respuesta") {
        if (!preguntaPendienteId) {
            alert("No hay preguntas pendientes por responder.");
            return;
        }

        await enviarRespuesta(preguntaPendienteId);
        return;
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    if (!token || !usuarioLogueadoId) {
        window.location.href = "../../html/usuario/inicioSesion.html";
        window
        return;
    }

    await cargarConversaciones();
    mostrarUsuarioConectado()
});