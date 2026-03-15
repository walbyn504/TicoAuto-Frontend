async function cargarConversaciones() {
    try {
        const [responseMisPreguntas, responsePreguntasDeMisVehiculos] = await Promise.all([
            fetch(`${apiBaseUrl}/api/pregunta/obtenerMisPreguntas`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }),
            fetch(`${apiBaseUrl}/api/obtenerPreguntasDeMisVehiculos`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
        ]);

        const misPreguntas = await responseMisPreguntas.json();
        const preguntasDeMisVehiculos = await responsePreguntasDeMisVehiculos.json();

        if (!responseMisPreguntas.ok) {
            alert(misPreguntas.mensaje);
            return;
        }

        if (!responsePreguntasDeMisVehiculos.ok) {
            alert(preguntasDeMisVehiculos.mensaje);
            return;
        }

        const todasLasPreguntas = [
            ...misPreguntas,
            ...preguntasDeMisVehiculos
        ];

        conversacionesAgrupadas = {};

        // Agrupa las preguntas por vehículo para formar conversaciones
        agruparConversacionesPorVehiculo(todasLasPreguntas);
        await mostrarListaConversaciones(); // Muestra la lista de conversaciones

    } catch (error) {
        console.error(error);
        alert("Error al cargar conversaciones.");
    }
}

//Ordena las preguntas que se recibieron
function agruparConversacionesPorVehiculo(preguntasRecibidas) {

    // Recorre todas las preguntas recibidas del backend
    for (let i = 0; i < preguntasRecibidas.length; i++) {
        const item = preguntasRecibidas[i];

        // Valida que exista la pregunta y el vehículo
        if (!item.pregunta || !item.pregunta.vehiculo) {
            continue;
        }

        // Obtiene el vehículo asociado a la pregunta
        const vehiculo = item.pregunta.vehiculo;
        const vehiculoId = vehiculo._id;
        const interesadoId = item.pregunta.usuario._id;

        const conversacionId = `${vehiculoId} - ${interesadoId}`;

        // Si aún no existe una conversación para ese vehículo, la crea
        if (!conversacionesAgrupadas[conversacionId]) {
            conversacionesAgrupadas[conversacionId] = {
                conversacionId: conversacionId,
                vehiculoId: vehiculo._id,
                propietarioId: vehiculo.usuario._id,
                propietario: vehiculo.usuario.nombre,
                interesadoId: interesadoId,
                marca: vehiculo.marca,
                modelo: vehiculo.modelo,
                mensajes: [] // Lista de mensajes del chat
            };
        }

        // Verifica si esa pregunta ya existe dentro de la conversación
        const yaExiste = conversacionesAgrupadas[conversacionId].mensajes.find(
            mensaje => mensaje.pregunta._id === item.pregunta._id
        );

        // Agrega la pregunta y respuesta solo si no existe
        if (!yaExiste) {
            conversacionesAgrupadas[conversacionId].mensajes.push({
                pregunta: item.pregunta,
                respuesta: item.respuesta
            });
        }
    }
}

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
            ${c.propietario}
            ${c.marca} ${c.modelo} 
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

//Decide que chat abrir cuando carga la pagina
async function abrirConversacionInicial(conversaciones) {

    if (conversacionSeleccionada) {
        await seleccionarConversacion(conversacionSeleccionada);
        return;
    }

    if (vehiculoIdUrl) {

        // Buscar si ya existe conversación para ese vehículo
        for (let i = 0; i < conversaciones.length; i++) {
            if (conversaciones[i].vehiculoId === vehiculoIdUrl) {
                await seleccionarConversacion(conversaciones[i].conversacionId);
                return;
            }
        }

        // Si no existe conversación todavía
        await seleccionarConversacion(vehiculoIdUrl);
        return;
    }

    if (conversaciones.length > 0) {
        await seleccionarConversacion(conversaciones[0].conversacionId);
        return;
    }

    // Si no hay conversaciones
    document.getElementById("mensajesChat").innerHTML = "";
    document.getElementById("textoPregunta").value = "";
}

async function seleccionarConversacion(conversacionId) {

    conversacionSeleccionada = conversacionId;
    document.getElementById("textoPregunta").value = "";

    const conversacion = conversacionesAgrupadas[conversacionId];

    // Si ya existe conversación
    if (conversacion) {
        mostrarConversacionExistente(conversacion);
        return;
    }

    // Si aún no existe conversación
    await mostrarVehiculoSinConversacion(conversacionId);
}

function mostrarConversacionExistente(conversacion) {

    document.getElementById("encabezadoChat").textContent =
        conversacion.propietario + " - " + conversacion.marca + " " + conversacion.modelo;

    mostrarMensajes(conversacion.mensajes);

    const esPropietario = usuarioLogueadoId === conversacion.propietarioId;

    if (esPropietario) {

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
            modoEnvio = "sinAccion";
            preguntaPendienteId = null;
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

    document.getElementById("mensajesChat").innerHTML = "";

    if (usuarioLogueadoId === vehiculo.usuario._id) {
        modoEnvio = "sinAccion";
    } else {
        modoEnvio = "pregunta";
    }

    preguntaPendienteId = null;
}

function mostrarMensajes(mensajes) {
    const contenedor = document.getElementById("mensajesChat"); //Mensajes del chat
    contenedor.innerHTML = "";

    // Ordena los mensajes por la fecha de la pregunta (de más vieja a más nueva)
    mensajes.sort((a, b) => {
        return new Date(a.pregunta.fechaPregunta) - new Date(b.pregunta.fechaPregunta);
    });

    // Recorre todos los mensajes de la conversación
    for (let i = 0; i < mensajes.length; i++) {
        const item = mensajes[i];

        // Muestra la pregunta del usuario interesado
        contenedor.innerHTML += `
            <div class="mensaje-usuario mb-2">
                <div class="burbuja usuario">${item.pregunta.pregunta}</div>
            </div>
        `;

        // Si existe respuesta del propietario, la muestra
        if (item.respuesta) {
            contenedor.innerHTML += `
                <div class="mensaje-propietario mb-2">
                    <div class="burbuja propietario">${item.respuesta.respuesta}</div>
                </div>
            `;
        }
    }
}

async function obtenerVehiculo(vehiculoId) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${vehiculoId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const vehiculo = await response.json();

        if (!response.ok) {
            return null;
        }

        return vehiculo;

    } catch (error) {
        alert("Error al obtener el vehículo.");
        return null;
    }
}