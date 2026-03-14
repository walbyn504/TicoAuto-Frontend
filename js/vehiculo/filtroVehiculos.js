const apiBaseUrl = 'http://localhost:3001';
const token = sessionStorage.getItem('token');

let paginaActual = 1;
let totalPaginas = 1;

// --- Función principal: inicializa la página ---
async function initFiltroVehiculos() {
    verificarUsuario();
    await ejecutarBusqueda(1);
}

function mostrarVehiculos(vehiculos) {
    const contenedor = document.getElementById('vehiculosContainer');
    contenedor.innerHTML = '';

    const usuarioLogueado = sessionStorage.getItem("usuario");

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
                        <button class="btn btn-secondary btn-sm flex-fill" onclick="copiarEnlace('${v._id}')">
                            Copiar enlace
                        </button>
                        ${usuarioLogueado ? `
                            <button class="btn btn-secondary btn-sm flex-fill" onclick="abrirPaginaPregunta('${v._id}')">
                                Enviar Mensaje
                            </button>
                        ` : ""}
                    </div>
                </div>
            </div>
        `;

        contenedor.appendChild(card);
    });
}

function verificarUsuario() {
    const usuario = sessionStorage.getItem("usuario");

    const nombreCont = document.getElementById("nombreUsuario");
    const botonesCont = document.getElementById("botonesUsuario");
    const menuCont = document.getElementById("menuOpciones");

    if (!usuario) {
        nombreCont.innerHTML = "";
        menuCont.innerHTML = "";

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

        menuCont.innerHTML = `
            <div class="dropdown me-3">
                <button class="btn btn-dark" data-bs-toggle="dropdown">
                    <i class="bi bi-three-dots-vertical fs-4"></i>
                </button>

                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item" href="/html/vehiculo/gestionVehiculo.html">
                            Gestionar Vehículos
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item" href="/html/vehiculo/enviarPregunta.html">
                            Imbox
                        </a>
                    </li>
                </ul>
            </div>
        `;

        botonesCont.innerHTML = `
            <button onclick="cerrarSesion()" class="btn btn-outline-light">
                Cerrar sesión
            </button>
        `;
    }
}

// --- Filtrar vehículos ---
async function ejecutarBusqueda(page = paginaActual) {
    try {
        paginaActual = page;

        const marca = document.getElementById('marca').value.trim();
        const modelo = document.getElementById('modelo').value.trim();
        const anno_min = document.getElementById('minAnno').value;
        const anno_max = document.getElementById('maxAnno').value;
        const precio_min = document.getElementById('minPrecio').value;
        const precio_max = document.getElementById('maxPrecio').value;
        const estado = document.getElementById('estado').value;

        const limit = 3;
        const params = new URLSearchParams();

        if (marca) params.append('marca', marca);
        if (modelo) params.append('modelo', modelo);
        if (anno_min) params.append('anno_min', anno_min);
        if (anno_max) params.append('anno_max', anno_max);
        if (precio_min) params.append('precio_min', precio_min);
        if (precio_max) params.append('precio_max', precio_max);
        if (estado) params.append('estado', estado);

        params.append('page', paginaActual); //Se agrega a la url la pagina 
        params.append('limit', limit);

        history.replaceState(null, "", "?" + params.toString());

        const response = await fetch(`${apiBaseUrl}/api/vehiculos/filtro?${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            document.getElementById('vehiculosContainer').innerHTML = '';
            return;
        }

        // Devuelve los filtros aplicados
        mostrarVehiculos(data.vehiculos);

        // Respuesta del backend
        paginaActual = data.paginaActual; // pagina real
        totalPaginas = data.totalPaginas; // paginas totales

        document.getElementById("numeroPagina").textContent = paginaActual;

    } catch (error) {
        alert("No se pudo conectar al servidor ❌");
    }
}

function paginaSiguiente() {
    if (paginaActual < totalPaginas) {
        paginaActual++;
        ejecutarBusqueda(paginaActual);
    }
}

function paginaAnterior() {
    if (paginaActual > 1) {
        paginaActual--;
        ejecutarBusqueda(paginaActual);
    }
}

function verDetalles(id) {
    location.href = `html/vehiculo/verInfoVehiculo.html?id=${id}`;
}

function copiarEnlace(id) {
    try {
        const enlace = `${window.location.origin}/html/vehiculo/verInfoVehiculo.html?id=${id}`;
        navigator.clipboard.writeText(enlace);
        alert("Enlace copiado al portapapeles ✅");
    } catch (error) {
        alert("No se pudo copiar el enlace ❌");
        console.error(error);
    }
}

function abrirPaginaPregunta(vehiculoId){
    window.location.href = `/html/vehiculo/enviarPregunta.html?vehiculoId=${vehiculoId}`;
}

function refrescar() {
    history.replaceState(null, "", window.location.pathname);
    limpiarCampos();
    paginaActual = 1;
    ejecutarBusqueda(1);
}

function limpiarCampos() {
    document.getElementById('marca').value = "";
    document.getElementById('modelo').value = "";
    document.getElementById('minAnno').value = "";
    document.getElementById('maxAnno').value = "";
    document.getElementById('minPrecio').value = "";
    document.getElementById('maxPrecio').value = "";
    document.getElementById('estado').value = "";
}

function cerrarSesion() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
    window.location.href = "/html/usuario/inicioSesion.html";
}

initFiltroVehiculos();