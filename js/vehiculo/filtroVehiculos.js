const URL_API = 'http://localhost:3001/api/vehiculos';


async function ejecutarBusqueda() {
    const lista = document.getElementById('lista-vehiculos');
    
    // 1. Recoger datos de los inputs de forma agrupada
    const filtros = {
        marca: document.getElementById('marca').value.trim(),
        estado: document.getElementById('estado').value,
        minPrecio: document.getElementById('minPrecio').value,
        maxPrecio: document.getElementById('maxPrecio').value
    };

    // 2. Limpiar campos vacíos para no enviarlos
    const params = new URLSearchParams();
    for (let k in filtros) { if (filtros[k]) params.append(k, filtros[k]); }

    try {
        const res = await fetch(`${URL_API}?${params}`);
        const vehiculos = await res.json();

        // 3. Dibujar resultados (usando .map para ahorrar código)
        lista.innerHTML = vehiculos.map(v => `
            <div class="tarjeta">
                <h3>${v.marca} ${v.modelo || ''}</h3>
                <p>Precio: $${v.precio}</p>
                <p>Estado: ${v.estado}</p>
            </div>
        `).join('') || '<p>No se encontraron resultados</p>';

    } catch (e) {
        lista.innerHTML = '<p style="color:red;">Error de conexión</p>';
    }
}

// Carga inicial
document.addEventListener('DOMContentLoaded', ejecutarBusqueda);
