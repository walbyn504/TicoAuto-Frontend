const apiBaseUrl = 'http://localhost:3001';

// Se ejecuta al cargar la página
window.onload = obtenerVehiculos;

// ------------------- OBTENER VEHÍCULOS -------------------
async function obtenerVehiculos() {
    try {

        const response = await fetch(`${apiBaseUrl}/api/vehiculos`, {
        });

        if (response.status === 200) {
            const vehiculos = await response.json();
            mostrarVehiculos(vehiculos);
        } else {
            alert("Error al cargar vehículos ❌");
        }

    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
}

// ------------------- MOSTRAR VEHÍCULOS EN CARDS -------------------
function mostrarVehiculos(vehiculos) {
    const container = document.getElementById("vehiculosContainer");
    container.innerHTML = "";

    vehiculos.forEach(v => {
        const card = document.createElement("div");
        card.className = "col-md-4 mb-4";

        card.innerHTML = `
            <div class="card h-100">
                <img src="${v.imagen}" class="card-img-top" alt="${v.marca} ${v.modelo}">
                <div class="card-body">
                    <h5 class="card-title">${v.marca} ${v.modelo}</h5>
                    <p class="card-text">
                        <strong>Año:</strong> ${v.anno} <br>
                        <strong>Precio:</strong> $${v.precio} <br>
                        <strong>Estado:</strong> ${v.estado || "Disponible"}
                    </p>
                    <button class="btn btn-primary btn-sm" 
                        onclick="location.href='html/vehiculo/formularioVehiculo.html?id=${v._id}'">
                        Editar
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarVehiculo('${v._id}')">Eliminar</button>
                    <button class="btn btn-success btn-sm" onclick="marcarVendido('${v._id}')">Vendido</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}



function eliminarVehiculo(id) {
    alert(`Eliminar vehículo ${id}`);
}

function marcarVendido(id) {
    alert(`Marcar como vendido vehículo ${id}`);
}
