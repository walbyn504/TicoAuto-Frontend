const apiBaseUrl = 'http://localhost:3001';

function verificarSesion() {
    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Debe iniciar sesión");
        location.href = "/html/usuario/inicioSesion.html";
        return null;
    }

    return token;
}

function obtenerVehiculoId() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

async function crearPregunta() {
    const token = verificarSesion();
    if (!token) return;

    const vehiculoId = obtenerVehiculoId();
    const texto = document.getElementById("textoPregunta").value.trim();

    if (!texto) {
        alert("Debe escribir una pregunta ❌");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${vehiculoId}/pregunta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ texto })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Error al crear la pregunta ❌");
            return;
        }

        alert("Pregunta enviada correctamente ✅");
        document.getElementById("textoPregunta").value = "";
        obtenerPreguntasPorVehiculo();
    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
}

