# COMO CORRER EL PROGRAMA
Para que el programa funcione correctamente necesita una instalación de MongoDB corriendo en el puerto 27017. Con una db llamada "fcRecog" y las colecciones "estudiantes" y "images". Esto es una solución temporal hasta que la base de datos sea desplegada en un io

Para correr el programa se necesita correr 3 diferentes partes. La primera es el backend:

### Backend
1. Navegar a la carpeta de "backend"
2. Correr el comando `python server.py`

### Frontend
Luego correr el frontend:
1. Navegar a la carpeta de "frontend"
2. Correr el comando `npm install`
3. Correr el comando `npm start`
4. Ir a la ruta [http://localhost:3000](http://localhost:3000) en su navegador
5. Dar click en "nuevo estudiante"
6. Capturar los datos
7. Dar click en "Comenzar camara"
8. Dar click en  "Capturar camara y datos"
9. En la derecha dar click a "Estadísticas"
10. Comprobar los datos

### Registro y Cámara
Una vez con el frontend y el registro puede correr el archivo de la camara:
1. Navegar a la carpeta "faceRecon" dentro de la carpeta "backend"
2. Correr el archivo `main.py`
3. Una vez vea su nombre en la pantalla abajo de su cara navegar de nuevo a la pagina
4. Dar click en "Estadísticas"
5. Comprobar su asistencia
