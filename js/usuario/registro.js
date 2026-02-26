const apiBaseUrl = 'http://localhost:3001';

async function registrarUsuario() {
    const nombre = document.getElementById('nombre').value.trim();
    const primerApellido = document.getElementById('primerApellido').value.trim();
    const segundoApellido = document.getElementById('segundoApellido').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasenna = document.getElementById('contrasenna').value.trim();

    if (!nombre || !primerApellido || !correo || !contrasenna) {
        alert('Complete todos los campos correctamente');
        return;
    }

    try {
        const response = await fetch(`${apiBaseUrl}/api/autenticacion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, primerApellido, segundoApellido, correo, contrasenna })
        });

        if (response.status === 201) {
            alert("Usuario registrado correctamente ✅");
            location.href = '#';
        } 
        else if (response.status === 400) {
            alert("Datos inválidos ❌");
        }
        else if (response.status === 500) {
            alert("Error del servidor ❌");
        }
    } catch (error) {
        alert("No se pudo conectar al servidor");
    }
}
