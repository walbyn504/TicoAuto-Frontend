const apiBaseUrl = 'http://localhost:3001';

const token = sessionStorage.getItem('token');

// --- Función principal: inicializa la página ---
async function initFiltroVehiculos() {
    await cargarVehiculos(), verificarUsuario();

}

// --- Cargar vehículos para el filtro ---
async function cargarVehiculos() {
    try {
        const response = await fetch(`${apiBaseUrl}/api/vehiculos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const vehiculos = await response.json();

        if (!response.ok){
            alert (vehiculos.message);
            return
        }

        mostrarVehiculos(vehiculos);
    } catch (error) {
        alert("No se pudieron cargar los vehículos ❌");
    }
}

// --- Mostrar vehículos en cartas ---
function mostrarVehiculos(vehiculos) {
    const contenedor = document.getElementById('vehiculosContainer');
    contenedor.innerHTML = '';  
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

                        <button class="btn btn-primary btn-sm flex-fill" onclick="verDetalles('${v._id}')">
                            Ver Detalle
                        </button>

                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

function verificarUsuario() {
    const token = sessionStorage.getItem("token");
    const usuario = sessionStorage.getItem("usuario");

    const nombreCont = document.getElementById("nombreUsuario");
    const botonesCont = document.getElementById("botonesUsuario");

    if (!token || !usuario) {
        nombreCont.innerHTML = "";
        botonesCont.innerHTML = `
            <a href="/html/usuario/inicioSesion.html" class="btn btn-outline-light me-2">
                Iniciar Sesión
            </a>
            <a href="/html/usuario/registro.html" class="btn btn-primary">
                Registrarse
            </a>
        `;
    } else {
        nombreCont.innerHTML = `👤 ${usuario}`;
        botonesCont.innerHTML = `
            <button onclick="cerrarSesion()" class="btn btn-outline-light">
                Cerrar sesión
            </button>
        `;
    }
}

// --- Filtrar vehículos ---
async function ejecutarBusqueda() {
    try {

        const marca = document.getElementById('marca').value.trim();
        const modelo = document.getElementById('modelo').value.trim();
        const anno_min = document.getElementById('minAnno').value;
        const anno_max = document.getElementById('maxAnno').value;
        const precio_min = document.getElementById('minPrecio').value;
        const precio_max = document.getElementById('maxPrecio').value;
        const estado = document.getElementById('estado').value;
         
        // Construir query params dinámicamente
        const params = new URLSearchParams();

        // Agregar parámetros (campos) que el usuario ha llenado
        if (marca) {
            params.append('marca', marca); 
        }
        if (modelo) {
            params.append('modelo', modelo);
        }
        if (anno_min) {
            params.append('anno_min', anno_min);
        }
        if (anno_max) {
            params.append('anno_max', anno_max);
        }
        if (precio_min) {
            params.append('precio_min', precio_min);
        }
        if (precio_max) {
            params.append('precio_max', precio_max);
        }
        if (estado) {
            params.append('estado', estado);
        }

        const response = await fetch(`${apiBaseUrl}/api/vehiculos/filtro?${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const vehiculos = await response.json();

        if (!response.ok) {
            limpiarCampos();
           alert (vehiculos.message);
           return
        }

        mostrarVehiculos(vehiculos);

    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
}

function verDetalles(id){
    location.href = `html/vehiculo/verInfoVehiculo.html?id=${id}`;
}

function refrescar(){
    limpiarCampos();
    cargarVehiculos();
}

function limpiarCampos(){ 
    document.getElementById ('marca').value = "";
    document.getElementById ('modelo').value = "";
    document.getElementById ('minAnno').value = "";
    document.getElementById ('maxAnno').value = "";
    document.getElementById ('minPrecio').value = "";
    document.getElementById ('maxPrecio').value = "";
    document.getElementById ('estado').value = "";
}

function cerrarSesion(){
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    window.location.href = "/html/usuario/inicioSesion.html";
}

initFiltroVehiculos();