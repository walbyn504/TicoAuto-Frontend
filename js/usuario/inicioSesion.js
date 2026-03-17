const apiBaseUrl = 'http://localhost:3001';

async function iniciarSesion() {
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();
    if (!correo || !contrasenna) {
        alert('Complete todos los campos correctamente');
        return;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexCorreo.test(correo)) {
        alert("El formato del correo no es válido");
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/autenticacion/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Enviar solo correo y contraseña para autenticación
            body: JSON.stringify({ correo: correo, contrasenna: contrasenna })
        });
        const data = await response.json();

        if (response.ok) {

            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('usuario', data.nombre);
            sessionStorage.setItem('usuarioId', data.usuarioId);

            alert("Inicio de sesión exitoso ✅");
            location.href = '../../index.html';

        } else {
            alert(data.message);
            return;
        }

        } catch (error) {
            alert("No se pudo conectar al servidor");
        }
}