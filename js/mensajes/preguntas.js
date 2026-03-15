async function enviarPregunta() {
    const textarea = document.getElementById("textoPregunta");
    const texto = textarea.value.trim();

    if (!texto) {
        alert("Debes escribir una pregunta.");
        return;
    }

    if (!conversacionSeleccionada) {
        alert("Debes seleccionar una conversación.");
        return;
    }

    const conversacion = conversacionesAgrupadas[conversacionSeleccionada];

    if (!conversacion) {
        alert("No se encontró la conversación seleccionada.");
        return;
    }

    const vehiculoId = conversacion.vehiculoId;

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${vehiculoId}/pregunta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                pregunta: texto
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || data.mensaje || "Error al enviar pregunta.");
            return;
        }

        textarea.value = "";
        await cargarConversaciones();

    } catch (error) {
        console.error(error);
        alert("Error al enviar pregunta.");
    }
}