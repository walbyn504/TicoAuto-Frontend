//Crea la lista lateral de los chats
async function mostrarListaConversaciones() {
    const lista = document.getElementById("listaConversaciones");
    lista.innerHTML = ""; //Limpia (Evita duplicaciones)

    //Convierte el objeto a lista
    const conversaciones = Object.values(conversacionesAgrupadas);

    for (let i = 0; i < conversaciones.length; i++) {
        const c = conversaciones[i];

        const item = document.createElement("div");
        item.className = "chat-item";
        item.innerHTML = `
            <strong>${c.propietario}</strong>
            <small>${c.marca} ${c.modelo}</small>
        `;

        //Selecciona la conversacion del vehiculo
        item.onclick = function () {
            seleccionarConversacion(c.conversacionId);
        };

        lista.appendChild(item);
    }

    //Muestra la conversacion del vehiculo
    await abrirConversacionInicial(conversaciones);
}

async function seleccionarConversacion(conversacionId) {
    conversacionSeleccionada = conversacionId;
    document.getElementById("textoPregunta").value = "";

    const items = document.querySelectorAll(".chat-item");
    items.forEach(item => item.classList.remove("activo"));

    const conversacion = conversacionesAgrupadas[conversacionId];

    if (conversacion) {
        const conversaciones = Object.values(conversacionesAgrupadas);
        const index = conversaciones.findIndex(c => c.conversacionId === conversacionId);

        if (index !== -1 && items[index]) {
            items[index].classList.add("activo");
        }

        mostrarConversacionExistente(conversacion);
        return;
    }

    await mostrarVehiculoSinConversacion(conversacionId);
}

function mostrarConversacionExistente(conversacion) {
    document.getElementById("encabezadoChat").textContent =
        conversacion.propietario + " - " + conversacion.marca + " " + conversacion.modelo;

    mostrarMensajes(conversacion.mensajes);

    const esPropietario = usuarioLogueadoId === conversacion.propietarioId;

    if (esPropietario) {
        let preguntaSinRespuesta = null;

        for (let i = 0; i < conversacion.mensajes.length; i++) {
            if (!conversacion.mensajes[i].respuesta) {
                preguntaSinRespuesta = conversacion.mensajes[i];
                break;
            }
        }

        if (preguntaSinRespuesta) {
            modoEnvio = "respuesta";
            preguntaPendienteId = preguntaSinRespuesta.pregunta._id;
        } else {
            // Ya no hay pendiente, pero guardo la última pregunta
            modoEnvio = "respuesta";
            preguntaPendienteId = conversacion.mensajes[conversacion.mensajes.length - 1].pregunta._id;
        }

    } else {
        modoEnvio = "pregunta";
        preguntaPendienteId = null;
    }
}

async function mostrarVehiculoSinConversacion(vehiculoId) {

    const vehiculo = await obtenerVehiculo(vehiculoId);

    if (!vehiculo) {
        document.getElementById("encabezadoChat").textContent = "Vehículo no encontrado";
        document.getElementById("mensajesChat").innerHTML = "";
        return;
    }

    document.getElementById("encabezadoChat").textContent =
        vehiculo.usuario.nombre + " - " + vehiculo.marca + " " + vehiculo.modelo;

    document.getElementById("mensajesChat").innerHTML = `
    <div class="chat-vacio">
        <div>
            <i class="bi bi-chat-dots fs-1 d-block mb-2"></i>
            Aún no tienes conversaciones disponibles.
        </div>
    </div>
`;

    if (usuarioLogueadoId === vehiculo.usuario._id) {
        modoEnvio = "sinAccion";
    } else {
        modoEnvio = "pregunta";
    }

    preguntaPendienteId = null;
}


function mostrarMensajes(mensajes) {
    const contenedor = document.getElementById("mensajesChat");
    contenedor.innerHTML = "";

    // Ordena por fecha de la pregunta
    mensajes.sort((a, b) => new Date(a.pregunta.fechaPregunta) - new Date(b.pregunta.fechaPregunta));

    let ultimoUsuario = null;

    for (let i = 0; i < mensajes.length; i++) {
        const item = mensajes[i];

        // Mostrar pregunta del usuario con su nombre
        const usuarioPregunta = item.pregunta.usuario.nombre;
        const fechaPregunta = formatearFecha(item.pregunta.fechaPregunta);

        let nombreHTML = "";
        if (ultimoUsuario !== usuarioPregunta) {
            nombreHTML = `<div class="nombre">${usuarioPregunta}</div>`;
            ultimoUsuario = usuarioPregunta;
        }

        contenedor.innerHTML += `
            <div class="mensaje-usuario mb-2">
                ${nombreHTML}
                <div class="burbuja usuario">${item.pregunta.pregunta}</div>
                <div class="fecha">${fechaPregunta}</div>
            </div>
        `;

        // Mostrar respuesta del propietario con su nombre
        if (item.respuesta) {
            const nombreRespuesta = conversacionesAgrupadas[conversacionSeleccionada].propietario;
            const fechaRespuesta = formatearFecha(item.respuesta.fechaRespuesta);
            contenedor.innerHTML += `
            <div class="mensaje-propietario mb-2">
                <div class="nombre">${nombreRespuesta}</div>
                <div class="burbuja propietario">${item.respuesta.respuesta}</div>
                <div class="fecha">${fechaRespuesta}</div>
            </div> `;

            ultimoUsuario = null;
        }
    }

}

