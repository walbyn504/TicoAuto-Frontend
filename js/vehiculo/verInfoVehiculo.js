const apiBaseUrl = 'http://localhost:3001';
const token = sessionStorage.getItem('token');

// --- Función principal: inicializa la página ---


async function initVerVehiculo() {
    const id = getVehiculoIdFromUrl();
    if (!id) {
        alert("No se seleccionó ningún vehículo ❌");
        volver();
        return;
    }
    await cargarVehiculo(id);
}

function getVehiculoIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id'); // devuelve el valor de ?id=
}


// --- Cargar vehículo ---
async function cargarVehiculo(id) {
    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            const data = await response.json();
            alert(data.message || "No se pudo cargar el vehículo ❌");
            volver();
            return;
        }

        const vehiculo = await response.json();
        mostrarVehiculo(vehiculo);

    } catch (error) {
        alert("Error al conectar con el servidor ❌");
        volver();
    }
}

function mostrarVehiculo(vehiculo) {
    const contenedor = document.getElementById('vehiculoDetalles');

    let usuarioInfo = '';

    if (vehiculo.usuario) {
        // Siempre mostramos el nombre
        usuarioInfo += `<p><strong>Nombre:</strong> ${vehiculo.usuario.nombre}</p>`;

        // Si hay más campos, los mostramos
        if (vehiculo.usuario.primerApellido) {
            usuarioInfo += `
                <p><strong>Primer Apellido:</strong> ${vehiculo.usuario.primerApellido}</p>
                <p><strong>Segundo Apellido:</strong> ${vehiculo.usuario.segundoApellido}</p>
                <p><strong>Teléfono:</strong> ${vehiculo.usuario.telefono}</p>
                <p><strong>Correo:</strong> ${vehiculo.usuario.correo}</p>
            `;
        }
    } else {
        usuarioInfo = `<p>Vendedor no disponible</p>`;
    }

    contenedor.innerHTML = `
        <div class="detalle-vehiculo">
        
        <button class="btn-volver" onclick="volver()">
            →
        </button>

            <h1 class="detalle-titulo">${vehiculo.marca} ${vehiculo.modelo}</h1>
            <div class="detalle-precio">$${vehiculo.precio}</div>

            <div class="detalle-imagen-contenedor">
                <img 
                    src="${apiBaseUrl}/imagenes/${vehiculo.imagen}" 
                    class="detalle-imagen" 
                    alt="${vehiculo.marca} ${vehiculo.modelo}">
            </div>

            <div class="detalle-grid">
                <div class="detalle-seccion">
                    <h4 class="detalle-subtitulo">Información del vehículo</h4>
                    <p><strong>Año:</strong> ${vehiculo.anno}</p>
                    <p><strong>Estado:</strong> ${vehiculo.estado || "Disponible"}</p>
                    <p><strong>Combustible:</strong> ${vehiculo.combustible}</p>
                    <p><strong>Color:</strong> ${vehiculo.color}</p>
                    <p><strong>Transmisión:</strong> ${vehiculo.transmision}</p>
                    <p><strong>Condición:</strong> ${vehiculo.condicion}</p>
                </div>

                <div class="detalle-seccion">
                    <h4 class="detalle-subtitulo">Información del vendedor</h4>
                    ${usuarioInfo}
                </div>
            </div>

        </div>
    `;
}

// --- Botón volver ---
function volver() {
    window.history.back();
}

// --- Inicializar ---
initVerVehiculo();