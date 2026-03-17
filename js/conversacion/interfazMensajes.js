function agregarTituloSiCorresponde(lista, texto, yaAgregado) {
    if (!yaAgregado) {
        const titulo = document.createElement("div");
        titulo.className = "chat-seccion-titulo";
        titulo.innerText = texto;
        lista.appendChild(titulo);
        return true;
    }
    return yaAgregado;
}

//Crea la lista lateral de los chats
async function mostrarListaConversaciones() {
    const lista = document.getElementById("listaConversaciones");
    lista.innerHTML = "";
 
    //Convierte el objeto a lista
    const conversaciones = Object.values(conversacionesAgrupadas);

    let tituloRecibidasAgregado = false;
    let tituloRealizadasAgregado = false;

    for (let i = 0; i < conversaciones.length; i++) {
        const c = conversaciones[i];

        const esPropietario = String(usuarioLogueadoId) === String(c.propietarioId);

        if (esPropietario) {
            tituloRecibidasAgregado = agregarTituloSiCorresponde(
                lista,
                "Consultas recibidas",
                tituloRecibidasAgregado
            );
        } else {
            tituloRealizadasAgregado = agregarTituloSiCorresponde(
                lista,
                "Consultas realizadas",
                tituloRealizadasAgregado
            );
        }

        const nombreMostrar = esPropietario
            ? c.mensajes[0].pregunta.usuario.nombre
            : c.propietario;

        let tienePendiente = false;

        if (esPropietario && c.mensajes && c.mensajes.length > 0) {
            for (let j = 0; j < c.mensajes.length; j++) {
                if (!c.mensajes[j].respuesta) {
                    tienePendiente = true;
                    break;
                }
            }
        }

        const item = document.createElement("div");
        item.className = "chat-item";

        if (tienePendiente) {
            item.classList.add("chat-pendiente");
        }

        item.innerHTML = `
            <strong>${nombreMostrar}</strong>
            <small>
                ${c.marca} ${c.modelo}
                ${tienePendiente ? '<span class="chat-punto"></span>' : ''}
            </small>
        `;

        item.onclick = function () {
            document.querySelectorAll(".chat-item").forEach(chat => {
                chat.classList.remove("activo");
            });

            item.classList.add("activo");
            seleccionarConversacion(c.conversacionId);
        };

        lista.appendChild(item);
    }

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

