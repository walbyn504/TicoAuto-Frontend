async function enviarRespuesta(preguntaId) {

    const textarea = document.getElementById("textoPregunta");
    const texto = textarea.value.trim();

    if (!texto) {
        alert("Debes escribir una respuesta.");
        return;
    }

    try {

        const response = await fetch(`${apiBaseUrl}/api/pregunta/${preguntaId}/respuesta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                respuesta: texto
            })
        });

        const data = await response.json();

         if (!response.ok) {
            alert(data.message);
            return;
        }

        textarea.value = "";
        await cargarConversaciones();

    } catch (error) {
        console.error(error);
        alert("Error al enviar respuesta.");
    }
}