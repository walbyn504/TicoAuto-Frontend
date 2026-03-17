# TicoAuto-Frontend

El frontend de **TicoAuto** corresponde a la interfaz web del sistema que permite a los usuarios interactuar con la plataforma para gestionar y consultar vehículos en venta. A través de esta aplicación, los usuarios pueden registrarse, iniciar sesión, publicar vehículos, administrarlos y realizar búsquedas utilizando distintos filtros.

## Tecnologías utilizadas

- HTML5  
- CSS3  
- JavaScript  
- Bootstrap 5  
- Bootstrap Icons  

Estas tecnologías permiten desarrollar una interfaz web dinámica y responsiva que se comunica con el backend mediante solicitudes HTTP.

## Funcionalidades principales

El sistema permite a los usuarios realizar las siguientes acciones:

- Registro e inicio de sesión de usuarios.
- Publicación de vehículos con información como marca, modelo, año, precio y características.
- Visualización de los vehículos registrados por el usuario.
- Edición y eliminación de vehículos.
- Marcado de vehículos como vendidos.
- Búsqueda de vehículos mediante filtros (marca, modelo, año, precio y estado).
- Paginación de resultados en la búsqueda de vehículos.

## Validaciones implementadas

Se implementaron validaciones tanto en el frontend como en el backend para garantizar la integridad de los datos.

**En el frontend:**
- Verificación de sesión activa mediante token.
- Confirmación antes de eliminar o marcar un vehículo como vendido.
- Validación de campos obligatorios en formularios.
- Validación de valores numéricos y rangos en los filtros de búsqueda.

**En el backend:**
- Verificación de autenticación del usuario.
- Validación de existencia de los vehículos solicitados.
- Control de permisos del usuario sobre los vehículos que administra.
- Validación de datos antes de realizar operaciones en la base de datos.

## Comunicación con el backend

El frontend se comunica con el backend mediante solicitudes HTTP utilizando `fetch`.  
Las rutas protegidas utilizan autenticación mediante **Bearer Token**, el cual se almacena en `sessionStorage` después de iniciar sesión.

## Ejecución del proyecto

El proyecto puede ejecutarse directamente desde un navegador web o mediante herramientas como **Live Server** en Visual Studio Code.  
Es necesario que el backend de **TicoAuto** se encuentre en ejecución para que el sistema funcione correctamente.

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/walbyn504/TicoAuto-frontend