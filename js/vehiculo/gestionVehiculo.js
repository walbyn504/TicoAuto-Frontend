const apiBaseUrl = 'http://localhost:3001';

window.onload = obtenerVehiculos;

async function obtenerVehiculos() {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${apiBaseUrl}/api/mis-vehiculos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        let data = [];

        data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                alert(data.message || "Sesión expirada ❌");
                sessionStorage.removeItem("token");
                location.href = "/html/usuario/inicioSesion.html";
                return;
            }

            alert(data.message || "Error al cargar vehículos ❌");
            return;
        }

        mostrarVehiculos(data);

    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
}

function mostrarVehiculos(vehiculos) {
    const container = document.getElementById("vehiculosContainer");
    container.innerHTML = "";

    vehiculos.forEach(v => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";
        card.innerHTML = `
            <div class="card h-100">
                <img src="${apiBaseUrl}/imagenes/${v.imagen}" 
                     class="card-img-top" 
                     alt="${v.marca} ${v.modelo}">
                <div class="card-body">
                    <h5 class="card-title">${v.marca} ${v.modelo}</h5>
                    <p class="card-text">
                        <strong>Año:</strong> ${v.anno} <br>
                        <strong>Precio:</strong> $${v.precio} <br>
                        <strong>Estado:</strong> ${v.estado} <br>
                        <strong>Color:</strong> ${v.color} <br>
                        <strong>Condición:</strong> ${v.condicion} <br>
                        <strong>Combustible:</strong> ${v.combustible} <br>
                        <strong>Transmisión:</strong> ${v.transmision} <br> 
                    </p>
                    <div class="d-flex gap-2 mt-2">
                        <button class="btn btn-primary btn-sm flex-fill" onclick="editarVehiculo('${v._id}')">
                            Editar
                        </button>

                        <button class="btn btn-danger btn-sm flex-fill" onclick="eliminarVehiculo('${v._id}')">
                            Eliminar
                        </button>

                        <button class="btn btn-success btn-sm flex-fill" onclick="marcarVendido('${v._id}')">
                            Vendido
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function editarVehiculo(id) {
    location.href = `/html/vehiculo/formularioVehiculo.html?id=${id}`;
    
}

async function eliminarVehiculo(id) {
    if (!confirmarEliminacion()) return;
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Error al eliminar el vehículo ❌");
            return;
        }

        alert(data.message || "Vehículo eliminado correctamente ✅");
        obtenerVehiculos();

    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
}

function confirmarEliminacion() {
    return confirm("¿Seguro que desea eliminar este vehículo?");
}


function confirmarVendido() {
    return confirm("¿Seguro que desea marcar como vendido este vehículo?");
}

async function marcarVendido(id) {
    if (!confirmarVendido()) return;

    const token = sessionStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculo/vendido/${id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        
        let data = {};
        
        data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                alert(data.message || "Sesión expirada ❌");
                sessionStorage.removeItem("token");
                location.href = "/html/usuario/inicioSesion.html";
                return;
            }

            alert(data.message || "Error al marcar el vehículo como vendido ❌");
            return;
        }

        alert(data.message || "Vehículo marcado como vendido ✅");
        obtenerVehiculos();

    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
}

function cerrar() {
    location.href = "/index.html";
}
