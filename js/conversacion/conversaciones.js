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

        // Une ambas listas de preguntas en un solo arreglo
        const todasLasPreguntas = [
            ...misPreguntas,
            ...preguntasDeMisVehiculos
        ];

         // Reinicia el objeto donde se almacenan las conversaciones agrupadas
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