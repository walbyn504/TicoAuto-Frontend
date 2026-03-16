const apiBaseUrl = 'http://localhost:3001';

async function registrarUsuario() {
    const nombre = document.getElementById('nombre').value.trim();
    const primerApellido = document.getElementById('primerApellido').value.trim();
    const segundoApellido = document.getElementById('segundoApellido').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();

     if (!nombre || !primerApellido || !segundoApellido || !telefono || !correo || !contrasenna) {
        alert('Todos los campos son obligatorios');
        return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
        alert("El formato del correo no es válido");
        return;
    }

    const regexTelefono = /^[0-9]{8,}$/;
    if (!regexTelefono.test(telefono)) {
        alert("El teléfono debe tener al menos 8 dígitos");
        return;
    }

    const tieneMin = /[a-z]/.test(contrasenna);
    const tieneMay = /[A-Z]/.test(contrasenna);
    const tieneNumero = /\d/.test(contrasenna);
    const tieneEspecial = /[@$!%*?&.#_-]/.test(contrasenna);
    const largoMinimo = contrasenna.length >= 8;

    if (!(tieneMin && tieneMay && tieneNumero && tieneEspecial && largoMinimo)) {
        alert("La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y carácter especial.");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/autenticacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // convertimos los datos (javaScript) a JSON para enviarlos al servidor
            body: JSON.stringify({ nombre, primerApellido, segundoApellido, telefono, correo, contrasenna })
        });

        const data = await response.json();

        if (!response.ok) {
        alert(data.message); 
        return;
        }

        alert("Usuario registrado correctamente ✅");
        location.href = "/html/usuario/inicioSesion.html";

    } catch (error) {
        alert("No se pudo conectar al servidor");
    }
}
