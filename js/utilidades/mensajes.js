function verificarSesion() {

    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Debe iniciar sesión");
        location.href = "/html/usuario/inicioSesion.html";
        return null;
    }

    return token;
}


function manejarRespuesta(status, accion) {

    if (status === 201) {
        alert(`${accion} correctamente ✅`);
        location.href = "../../index.html";
    }

    else if (status === 200) {
        alert(`${accion} correctamente ✅`);
        location.href = "../../index.html";
    }

    else if (status === 404) {
        alert("Vehículo no encontrado ❌");
    }

    else if (status === 401) {
        alert("Sesión expirada ❌");
        sessionStorage.removeItem("token");
        location.href = "/html/usuario/inicioSesion.html";
    }

    else if (status === 400) {
        alert("Datos inválidos ❌");
    }

    else {
        alert("Error en el servidor ❌");
    }

}