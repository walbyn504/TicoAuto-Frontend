
let paginaActual = 1;
let totalPaginas = 1;

// --- Función principal: inicializa la página ---
async function initFiltroVehiculos() {
    verificarUsuario();
    await ejecutarBusqueda(1);
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
        

        if (!data.vehiculos || data.vehiculos.length === 0) {

            // Primero limpia los vehículos que estaban en pantalla
            const contenedor = document.getElementById('vehiculosContainer');
            contenedor.innerHTML = "";

            contenedor.innerHTML = `
                <div class="col-12 text-center text-white mt-5">
                    <h4> No se encontraron vehículos</h4>
                    <p>Intenta cambiar los filtros de búsqueda.</p>
                </div>
            `;

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



initFiltroVehiculos();