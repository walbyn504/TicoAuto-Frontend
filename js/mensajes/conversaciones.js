async function cargarConversaciones() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/pregunta/obtenerMisPreguntas`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const preguntasRecibidas = await response.json();

        if (!response.ok) {
            alert(preguntasRecibidas.mensaje);
            return;
        }
        // Agrupa las preguntas por vehículo para formar conversaciones
        agruparConversacionesPorVehiculo(preguntasRecibidas);
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

        // Obtiene el vehículo asociado a la pregunta
        const vehiculo = item.pregunta.vehiculo;
        const vehiculoId = vehiculo._id;

        // Si aún no existe una conversación para ese vehículo, la crea
        if (!conversacionesAgrupadas[vehiculoId]) {
            conversacionesAgrupadas[vehiculoId] = {
                vehiculoId: vehiculo._id,           
                propietario: vehiculo.usuario.nombre, 
                marca: vehiculo.marca,                
                modelo: vehiculo.modelo,              
                mensajes: [] // Lista de mensajes del chat
            };
        }

        // Agrega la pregunta y respuesta
        conversacionesAgrupadas[vehiculoId].mensajes.push({
            pregunta: item.pregunta,
            respuesta: item.respuesta
        });
    }
}
 //Crea la lista lateral de los chats
async function mostrarListaConversaciones() {
    const lista = document.getElementById("listaConversaciones");
    lista.innerHTML = ""; //Limpia (Evita duplicaciones)

    //Convierte el objeto a lista
    const conversaciones = Object.values(conversacionesAgrupadas);

    // Recorre la lista
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
            seleccionarConversacion(c.vehiculoId);
        };
        //Agrega a la lista
        lista.appendChild(item);
    }
    //Muestra la conversacion del vehiculo 
    await abrirConversacionInicial(conversaciones);
}

//Decide que chat abrir cuando carga la pagina
async function abrirConversacionInicial(conversaciones) {
    //Determina que conversacion va abrir
    const vehiculoASeleccionar = vehiculoSeleccionado || vehiculoIdUrl;
    // Abre la conversacion (vehiculo)
    if (vehiculoASeleccionar) {
        await seleccionarConversacion(vehiculoASeleccionar);
    } 
    //Sino hay, muestra la primera posicion
    else if (conversaciones.length > 0) {
        await seleccionarConversacion(conversaciones[0].vehiculoId);
    } 
    //Sino hay conversaciones (muestra vacío)
    else {
        document.getElementById("mensajesChat").innerHTML = "";
        document.getElementById("textoPregunta").value = "";
    }

}

async function seleccionarConversacion(vehiculoId) {
    vehiculoSeleccionado = vehiculoId; //Vehiculo seleccionado
    document.getElementById("textoPregunta").value = "";

    // Busca si ya existe una conversación cargada para ese vehículo
    const conversacion = conversacionesAgrupadas[vehiculoId];

    if (conversacion) {
        document.getElementById("encabezadoChat").textContent =
            `${conversacion.propietario} - ${conversacion.marca} ${conversacion.modelo}`;

        mostrarMensajes(conversacion.mensajes); // Muestra preguntas y respuestas
        return;
    }

    try {
        // Si no hay conversación, pide los datos del vehículo al backend
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${vehiculoId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const preguntasRecibidas = await response.json();

        // Obtiene el objeto del vehículo
        const vehiculo = preguntasRecibidas.vehiculo || preguntasRecibidas;

        if (!response.ok || !vehiculo) {
            document.getElementById("encabezadoChat").textContent = "Vehículo no encontrado";
            document.getElementById("mensajesChat").innerHTML = "";
            return;
        }
        const propietario = vehiculo.usuario.nombre;
        document.getElementById("encabezadoChat").textContent =
            `${propietario} - ${vehiculo.marca} ${vehiculo.modelo}`;

        // No hay mensajes todavía
        document.getElementById("mensajesChat").innerHTML = "";

    } catch (error) {
        alert("Ocurrió un error al cargar la conversación."); 
    }
}

function mostrarMensajes(mensajes) {
    const contenedor = document.getElementById("mensajesChat"); //Mensajes del chat
    contenedor.innerHTML = "";
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