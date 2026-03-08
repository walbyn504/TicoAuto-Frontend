const apiBaseUrl = 'http://localhost:3001';

window.onload = obtenerVehiculos;

function verificarSesion() {
    const token = sessionStorage.getItem('token');

    if (!token) {
        alert("Debe iniciar sesión");
        location.href = "/html/usuario/inicioSesion.html";
        return null;
    }

    return token;
}

async function obtenerVehiculos() {
    try {
        const res = await fetch(`${apiBaseUrl}/api/vehiculos`);
        if (res.status === 200) {
            const vehiculos = await res.json();
            mostrarVehiculos(vehiculos);
        } else {
            alert("Error al cargar vehículos ❌");
        }
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
                        <strong>Estado:</strong> ${v.estado || "Disponible"}
                    </p>
                    <div class="d-flex gap-2 mt-2">
                        <button class="btn btn-primary btn-sm flex-fill" onclick="editarVehiculo('${v._id}')">
                            Editar
                        </button>
                        <button class="btn btn-danger btn-sm flex-fill" onclick="eliminarVehiculo('${v._id}')">
                            Eliminar
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

function confirmarEliminacion() {
    return confirm("¿Seguro que desea eliminar este vehículo?");
}

async function eliminarVehiculo(id) {

    if (!confirmarEliminacion()) return;

    const token = verificarSesion();
    if (!token) return;

    try {
        const res = await fetch(`${apiBaseUrl}/api/vehiculo/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 200) {
            alert("Vehículo eliminado correctamente ✅");
            obtenerVehiculos();
        }
        else if (res.status === 404) {
            alert("El vehículo no existe ❌");
        }
        else {
            alert("Error al eliminar el vehículo ❌");
        }

    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
}

function cerrar() {
    location.href = "/index.html";
}

