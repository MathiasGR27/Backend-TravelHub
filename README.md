# TravelHub API - Sistema de Gestión de Reservas de Vuelos

TravelHub es una API REST profesional construida con **Node.js**, **Express** y **Sequelize**. El sistema permite gestionar el ciclo completo de una agencia de viajes: desde la oferta de vuelos y el registro de pasajeros, hasta un complejo sistema de fidelización por puntos y pagos.

---

## Funcionalidades Principales

* **Gestión de Usuarios:** Registro y autenticación mediante JWT (JSON Web Tokens).
* **Control de Roles:** Diferenciación de permisos entre usuarios estándar (`USER`) y administradores (`ADMIN`).
* **Reserva de Vuelos:** Creación de reservas con múltiples pasajeros por transacción.
* **Sistema de Fidelización:**

  * Acumulación de puntos por cada compra (1 unidad monetaria = 1 punto).
  * Redención de puntos para obtener descuentos progresivos (hasta el 30%).
* **Búsqueda Avanzada:** Filtros dinámicos por origen, destino, rango de precios y fechas.

---

## Stack Tecnológico

* **Entorno:** Node.js
* **Framework:** Express.js
* **Base de Datos:** PostgreSQL
* **ORM:** Sequelize
* **Seguridad:** Bcrypt.js (Hasheo de contraseñas) y JWT (Tokens de acceso)

---

## Estructura del Proyecto

```text
src/
├── controllers/    # Lógica de negocio (auth, pagos, reservas, vuelos)
├── middlewares/    # Validaciones de JWT y roles de usuario
├── models/         # Definición de tablas y relaciones de base de datos
├── routes/         # Definición de rutas y endpoints
├── app.js          # Configuración principal de Express
└── server.js       # Inicialización del servidor HTTP
```

---

## ⚙️ Instalación y Uso

1. **Requisitos previos**

   * Node.js v14+ instalado.
   * Instancia de PostgreSQL activa.

2. **Configuración del entorno**

Crea un archivo `.env` en la raíz del proyecto con los siguientes datos:

```env
PORT=8080
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=tu_clave_secreta_para_tokens
```

3. **Instalación de dependencias**

```bash
npm install
```

4. **Ejecución**

Para iniciar el proyecto (esto creará las tablas automáticamente):

```bash
npm start
```

Para desarrollo con recarga automática:

```bash
npm run dev
```

---

##  API Endpoints

###  Autenticación

| Método | Ruta               | Descripción                   |
| ------ | ------------------ | ----------------------------- |
| POST   | /api/auth/register | Registro de usuarios.         |
| POST   | /api/auth/login    | Login y retorno de Token JWT. |

###  Vuelos

| Método | Ruta               | Acceso  | Descripción                          |
| ------ | ------------------ | ------- | ------------------------------------ |
| GET    | /api/vuelos        | Público | Lista todos los vuelos disponibles.  |
| GET    | /api/vuelos/buscar | Público | Búsqueda con filtros (query params). |
| POST   | /api/vuelos        | Admin   | Crear nueva oferta de vuelo.         |
| PUT    | /api/vuelos/:id    | Admin   | Modificar vuelo.                     |
| DELETE | /api/vuelos/:id    | Admin   | Eliminar vuelo.                      |

###  Reservas y Pasajeros

| Método | Ruta                       | Acceso  | Descripción                         |
| ------ | -------------------------- | ------- | ----------------------------------- |
| POST   | /api/reservas              | Usuario | Crea reserva y asigna pasajeros.    |
| GET    | /api/reservas/mis-reservas | Usuario | Ver historial personal.             |
| GET    | /api/reservas              | Admin   | Ver todas las reservas del sistema. |

###  Pagos y Puntos

| Método | Ruta                     | Acceso  | Descripción                               |
| ------ | ------------------------ | ------- | ----------------------------------------- |
| POST   | /api/pagos/confirmar     | Usuario | Pagar reserva aplicando puntos/descuento. |
| GET    | /api/usuarios/mis-puntos | Usuario | Consultar balance de puntos actual.       |

###  Sistema de Descuentos por Puntos

El sistema aplica descuentos automáticos basados en la cantidad de puntos que el usuario decida redimir:

* 450 pts: 5% de descuento
* 900 pts: 10% de descuento
* 1500 pts: 15% de descuento
* 2000 pts: 20% de descuento
* 2500 pts: 25% de descuento
* 3000 pts: 30% de descuento

---
