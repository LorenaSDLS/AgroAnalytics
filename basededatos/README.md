Base de datos del proyecto
Configuración de la Base de Datos y Conexión con el Backend

https://drive.google.com/drive/folders/1SMuhs8FlpDfiTxo4_85FyR24RZ6EU2wn?usp=sharing



Aquí se explica qué se necesita instalar, cómo restaurar la base de datos desde el archivo compartido por Drive, y cómo conectar el backend a PostgreSQL utilizando pgAdmin.


 1. Requisitos previos

Se necesita instalar lo siguiente:

 a. PostgreSQL

Versión recomendada: PostgreSQL 15 o superior

Incluye el motor de base de datos y las herramientas de administración necesarias.

Descargar:
https://www.postgresql.org/download/

Durante la instalación:

Se te pedirá una contrseña que deberás guardar ya que se necesitará para conectarla. 

b. pgAdmin 4

Herramienta gráfica para importar la base de datos.

Descargar:
https://www.pgadmin.org/download/

c. Archivo de la Base de Datos haciendo un (dump)


Descargar el archivo .backup / .sql desde Drive
(Cópialo a una ruta).

2. Restaurar la Base de Datos en PostgreSQL usando pgAdmin
Paso 1. Abrir pgAdmin

Inicia sesión usando la contraseña del usuario postgres.

Paso 2. Crear una base de datos vacía

En el panel izquierdo, botón derecho sobre “Databases”.

Selecciona Create → Database.

Ponle nombre (ejemplo):
proyecto_fle

Guarda.

Paso 3. Restaurar desde el archivo compartido

Botón derecho sobre la base de datos recién creada → Restore…

En Format, selecciona:

SQL ya que es .sql

En Filename selecciona el archivo descargado del Drive.

Clic en Restore.

Si no aparece error, la BD ya está lista.


3. Conexión del Backend a PostgreSQL

El backend está configurado para conectarse mediante variables de entorno o directamente en el archivo de configuración

a. Datos para la conexión

Asegúrate de tener estos valores correctos:

Parámetro	Valor recomendado
Host	localhost
Port	5432
Database	nombre de la BD que restauraste (proyecto_fle)
User	postgres o el usuario creado
Password	contraseña que pusiste al instalar PostgreSQL

Ejemplo de configuración en .env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=proyecto_fle
DB_USER=postgres
DB_PASSWORD=tu_contraseña


Asegúrate de que:

el archivo .env exista

el backend lo esté leyendo correctamente

se haya instalado cualquier dependencia del ORM (SQLAlchemy, psycopg2, etc.)


4. Ejecutar el Backend

Una vez configurada la BD:

Entra al folder del backend:
cd (nombre del folder)

Instala dependencias (Python):
pip install -r requirements.txt

Corre el servidor:
python (nombre del código).py


Si todo está bien:

El servidor se levanta sin errores

Se conecta a la BD restaurada

Puedes consultar datos desde los endpoints

5. Verificación de la Conexión
Método 1. Desde pgAdmin

Ejecuta un query por ejemplo:

SELECT * FROM municipios LIMIT 5;

Método 2. Desde el backend

Revisa el endpoint que obtenga municipios, cultivos o métricas.

Si responde correctamente, todo está conectado.
