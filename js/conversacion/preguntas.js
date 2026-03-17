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

    // Busca el vehículo asociado a la conversación seleccionada
    const conversacion = conversacionesAgrupadas[conversacionSeleccionada];

    // Si ya existe conversación, toma el ID del vehículo desde esa conversación
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

        // Después de recargar las conversaciones, selecciona la conversación actualizada
        const nuevaConversacionId = `${vehiculoId} - ${usuarioLogueadoId}`;
        if (conversacionesAgrupadas[nuevaConversacionId]) {
            await seleccionarConversacion(nuevaConversacionId);
        }

    } catch (error) {
        console.error(error);
        alert("Error al enviar pregunta.");
    }
}