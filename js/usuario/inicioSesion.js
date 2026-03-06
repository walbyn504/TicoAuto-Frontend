const apiBaseUrl = 'http://localhost:3001';

async function iniciarSesion() {
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();
    if (!correo || !contrasenna) {
        alert('Complete todos los campos correctamente');
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

        if (response.ok) {
            // Obtener el token del servidor
            const data = await response.json();
            // Guardar el token en sessionStorage
            sessionStorage.setItem('token', data.token);
            alert("Inicio de sesión exitoso ✅");
            location.href = '../../index.html';
        }
        else if (response.status === 401) {
            alert("Credenciales inválidas ❌");
        }
    } catch (error) {
        alert("No se pudo conectar al servidor");
    }
}