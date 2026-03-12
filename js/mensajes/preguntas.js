async function enviarPregunta() {

    // Obtiene el textarea y el texto escrito
    const textarea = document.getElementById("textoPregunta");
    const texto = textarea.value.trim();

    // Verifica que el usuario haya escrito algo
    if (!texto) {
        alert("Debes escribir una pregunta.");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${vehiculoSeleccionado}/pregunta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ pregunta: texto })
        });
        const data = await response.json();

        if (!response.ok) {
            alert(data.mensaje);
            return;
        }
        textarea.value = "";
        alert("Mensaje enviado");
        window.location.href = "/index.html";

    } catch (error) {
        console.error(error);
        alert("Error al enviar la pregunta.");
    }
}