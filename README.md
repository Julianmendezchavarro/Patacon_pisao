# Patacon_pisao
Proyecto de grado para el sistema web de Patacon Pisao.

## Inicio rapido

1. Inicia MySQL desde XAMPP.
2. Ejecuta `backend\server.js` con Node.
3. Abre el frontend desde Visual Studio Code o entra a `http://localhost:3000/menu.html`.

Si quieres levantarlo mas rapido, usa:

`C:\xampp\htdocs\Patacon-pisao\iniciar-proyecto.bat`

## Nota importante

Aunque abras el HTML desde Visual Studio Code, el catalogo y los pedidos salen desde la API en `http://localhost:3000/api`.
Si MySQL o el backend no estan encendidos, el menu no podra cargar productos.

## Publicarlo sin localhost

Clonar el repositorio en otro PC no basta para ver todo el sistema porque este proyecto no es solo HTML:

- El frontend muestra la interfaz.
- El backend en Node responde `/api/productos`, `/api/pedidos` y autenticacion.
- MySQL guarda el catalogo y los pedidos.

Si quieres que funcione sin arrancar `localhost` en cada equipo, debes publicarlo en un servidor real con una URL publica.

Pasos generales:

1. Subir el backend Node a un hosting o servidor que soporte Node.js.
2. Crear una base de datos MySQL publica o del hosting.
3. Configurar las variables del backend usando [backend/.env.example](C:\xampp\htdocs\Patacon-pisao\backend\.env.example).
4. Publicar el frontend junto al backend para que el navegador consuma la API desde la misma URL.
5. Entrar desde cualquier PC con la URL publica del proyecto.

Si solo quieres verlo en red local, un PC puede dejar corriendo el proyecto y los demas entrar por la IP de ese equipo, por ejemplo:

`http://192.168.1.20:3000/menu.html`
