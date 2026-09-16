# backBasico

API REST para administrar una pizzeria. El proyecto parte del CRUD en memoria
realizado en clase y cambia la persistencia de pizzas a MongoDB mediante el
driver oficial para Node.js.

La organizacion toma como referencia la inyeccion de dependencias de NestJS:
`DatabaseService` administra una sola conexion y se inyecta en
`PizzasRepository`; las rutas HTTP no acceden directamente a MongoDB.

## Requisitos

- Node.js 18 o posterior.
- npm.
- Docker Desktop con Docker Compose, o una instancia de MongoDB accesible.
- MongoDB Compass, opcional para inspeccionar la base.
- Postman para ejecutar la coleccion incluida.

## Estructura relevante

```text
backBasico/
|-- config/
|   `-- database.js                # Conexion centralizada a MongoDB
|-- repositories/
|   `-- pizzas.repository.js       # Operaciones CRUD documentadas
|-- routes/
|   `-- pizzas.js                  # Endpoints HTTP asincronos
|-- middlewares/
|   `-- id.middleware.js           # Valida y transforma identificadores
|-- postman/
|   `-- backBasico.postman_collection.json
|-- docs/evidencias/               # Captura del Collection Runner
|-- docker-compose.yml             # MongoDB local con autenticacion
|-- .env.dev.example               # Plantilla de variables sin secretos reales
`-- index.js                       # Arranque y composicion de dependencias
```

Las rutas de bebidas y tamanios conservan su implementacion en memoria porque
la actividad solicita migrar el repositorio de pizzas.

## Instalacion

Desde la carpeta `backBasico`:

```powershell
npm install
Copy-Item .env.dev.example .env.dev
```

Antes de continuar, abre `.env.dev` y cambia la contrasena. Este archivo
se encuentra excluido de Git para que las credenciales no se publiquen.

## Base de datos con Docker

No es necesario crear manualmente la base ni la coleccion. MongoDB las crea al
insertar la primera pizza. El contenedor usa MongoDB 8.0, una version con
soporte vigente.

1. Verificar las credenciales locales en `.env.dev`:

   ```dotenv
   MONGO_INITDB_ROOT_USERNAME=admin
   MONGO_INITDB_ROOT_PASSWORD=cambia_esta_contrasena
   MONGODB_DATABASE=pizzeria
   PORT=3000
   ```

2. Iniciar el contenedor. Docker Compose carga `.env.dev` mediante la
   configuracion `env_file` de `docker-compose.yml`:

   ```powershell
   docker compose up -d
   ```

3. Confirmar que se encuentre activo:

   ```powershell
   docker compose ps
   ```

4. En MongoDB Compass, usar el usuario y la contrasena de
   `.env.dev`. Por ejemplo:

   ```text
   mongodb://admin:cambia_esta_contrasena@localhost:27017/?authSource=admin
   ```

La API carga `.env.dev`, construye la misma cadena de conexion y usa la
base indicada en `MONGODB_DATABASE`. La configuracion se encuentra centralizada
en `config/database.js`.

Las variables `MONGO_INITDB_ROOT_USERNAME` y
`MONGO_INITDB_ROOT_PASSWORD` solamente crean el usuario la primera vez que
MongoDB inicializa una carpeta `mongo_data` vacia. Cambiar el archivo despues
no cambia automaticamente las credenciales guardadas en una base ya creada.

Para detener MongoDB sin borrar sus datos:

```powershell
docker compose stop
```

Para volver a iniciarlo:

```powershell
docker compose start
```

La carpeta local `mongo_data` conserva la base aunque se elimine el contenedor.
No borres esa carpeta si necesitas conservar la informacion.

### Usar otra conexion

Para Atlas u otra instancia, se puede agregar una URI completa a
`.env.dev`; esta tiene prioridad sobre las credenciales locales:

```dotenv
MONGODB_URI=mongodb://usuario:contrasena@servidor:27017/?authSource=admin
```

## Ejecucion

Con MongoDB activo:

```powershell
npm start
```

Para desarrollo con reinicio automatico de Node.js:

```powershell
npm run dev
```

La API queda disponible en `http://localhost:3000`.

## Endpoints de pizzas

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/api/v1/pizzas` | Obtener todas las pizzas |
| `GET` | `/api/v1/pizzas/:id` | Obtener una pizza por id |
| `POST` | `/api/v1/pizzas` | Crear una pizza |
| `PUT` | `/api/v1/pizzas/:id` | Actualizar el nombre de una pizza |
| `DELETE` | `/api/v1/pizzas/:id` | Desactivar una pizza mediante borrado logico |

Ejemplo del cuerpo para crear una pizza:

```json
{
  "id": 1,
  "nombre": "Pepperoni"
}
```

Ejemplo del cuerpo para actualizarla:

```json
{
  "nombre": "Pepperoni especial"
}
```

## Borrado logico con `isActive`

El campo `isActive` indica si una pizza se encuentra disponible para las
operaciones de la API:

| Valor | Estado |
| --- | --- |
| `1` | La pizza esta activa |
| `0` | La pizza fue eliminada logicamente |

El cliente no necesita enviar `isActive` al crear una pizza. El repositorio lo
asigna automaticamente:

```json
{
  "id": 1,
  "nombre": "Pepperoni",
  "isActive": 1
}
```

- `POST /api/v1/pizzas` crea la pizza con `isActive: 1`.
- `GET /api/v1/pizzas` devuelve solamente las pizzas con `isActive: 1`.
- `GET /api/v1/pizzas/:id` no devuelve pizzas con `isActive: 0`.
- `PUT /api/v1/pizzas/:id` solamente modifica pizzas activas.
- `DELETE /api/v1/pizzas/:id` cambia `isActive` de `1` a `0`.

El endpoint `DELETE` no elimina fisicamente el documento de MongoDB. El id
permanece registrado y no puede utilizarse para crear otra pizza.

## Pruebas con Postman

1. Iniciar MongoDB y la API.
2. En Postman, seleccionar **Import**.
3. Importar `postman/backBasico.postman_collection.json`.
4. Abrir el Collection Runner y ejecutar toda la coleccion en el orden dado.
5. Confirmar que las seis peticiones y sus validaciones aparezcan en verde.
6. Tomar una captura completa del resultado.
7. Guardarla en `docs/evidencias/postman-crud.png`.
8. Reemplazar el bloque pendiente de la seccion siguiente por la imagen.

La coleccion genera un id nuevo al comenzar, por lo que puede repetirse sin
chocar con datos de una ejecucion anterior.

## Evidencia de Postman

> Pendiente: ejecutar la coleccion y guardar la captura real en
> `docs/evidencias/postman-crud.png`.

Cuando exista la captura, sustituir el aviso anterior por:

```markdown
![CRUD de pizzas aprobado en Postman](docs/evidencias/postman-crud.png)
```

## Referencia consultada

La implementacion sigue la documentacion oficial del driver de MongoDB para
Node.js:

- [Crear y reutilizar un MongoClient](https://www.mongodb.com/docs/drivers/node/current/connect/mongoclient/)
- [Referencia rapida de operaciones CRUD](https://www.mongodb.com/docs/drivers/node/current/reference/quick-reference/)
