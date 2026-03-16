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

    let vehiculoId = null;

    const conversacion = conversacionesAgrupadas[conversacionSeleccionada];

    if (conversacion) {
        vehiculoId = conversacion.vehiculoId;
    } else {
        vehiculoId = conversacionSeleccionada;
    }

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
            alert(data.mensaje);
            return;
        }

        textarea.value = "";
        await cargarConversaciones();

        // Después de guardar, ya debería existir la conversación real
        const nuevaConversacionId = `${vehiculoId} - ${usuarioLogueadoId}`;

        if (conversacionesAgrupadas[nuevaConversacionId]) {
            await seleccionarConversacion(nuevaConversacionId);
        }

    } catch (error) {
        console.error(error);
        alert("Error al enviar pregunta.");
    }
}