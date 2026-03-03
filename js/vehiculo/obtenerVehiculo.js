const apiBaseUrl = 'http://localhost:3001';

window.onload = obtenerVehiculos;

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
    sessionStorage.setItem('vehiculoId', id);
    location.href = 'html/vehiculo/formularioVehiculo.html';
}

function eliminarVehiculo(id) {
    
}

function cerrarSesion() {
    sessionStorage.removeItem("token");
    location.href = "/html/usuario/inicioSesion.html";
}