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
    contenedor.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <img src="${apiBaseUrl}/imagenes/${vehiculo.imagen}" 
                     class="img-fluid rounded" 
                     alt="${vehiculo.marca} ${vehiculo.modelo}">
            </div>
            <div class="col-md-6">
                <h3>${vehiculo.marca} ${vehiculo.modelo}</h3>
                <p><strong>Año:</strong> ${vehiculo.anno}</p>
                <p><strong>Precio:</strong> $${vehiculo.precio}</p>
                <p><strong>Estado:</strong> ${vehiculo.estado || "Disponible"}</p>
                <p><strong>Combustible:</strong> ${vehiculo.combustible}</p>
                <p><strong>Color:</strong> ${vehiculo.color}</p>
                <p><strong>Transmisión:</strong> ${vehiculo.Transmision}</p>
                <p><strong>Condición:</strong> ${vehiculo.condicion}</p>

                <hr>
                <h5>Vendedor</h5>
                <p><strong>Nombre:</strong> ${vehiculo.usuario.nombre}</p>
                <p><strong>Email:</strong> ${vehiculo.usuario.primerApellido}</p>
                <p><strong>Email:</strong> ${vehiculo.usuario.segundoApellido}</p>
                <p><strong>Email:</strong> ${vehiculo.usuario.telefono}</p>
                <p><strong>Email:</strong> ${vehiculo.usuario.correo}</p>
                <hr>
                
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