
Contenidos que se podrán encontrar por carpeta:

    - tf/
        · Todos los archivos de configuración de terraform, para el correcto despliegue de mi proyecto en AWS.
        · Las claves pública y privada correspondientes para conectarme a mi máquina por SSH.
    
    - tripwme/
        · certs/ -> Certificados para la securización de mi página en httpS.
        · docs/ -> Documentación de código generada con JSDOC.
        · Dockerfile -> Dockerfile correspondiente para lanzar la parte de react (front) de mi proyecto.
        · nginx.conf -> Configuración personalizada necesaria para mi contenedor de nginx empleado.
        · El resto son los archivos directamente de todo mi proyecto react como los componentes o las páginas, etc.  
          También hay algunos archivos de configuración de JSDOC y JEST (este último es el empleado para realizar las pruebas unitarias,
          que se encuentran en src/utils).

    - twm/
        · Dockerfile -> Dockerfile correspondiente para lanzar la parte de symfony (back) de mi proyecto.
        · 000-default.conf -> Configuración personalizada necesaria para mi contenedor de symfony empleado.
        · El resto son los archivos directamente de mi proyecto symfony como los controladores, el .env, etc.
    
Además de las carpetas, fuera de ellas se encuentran archivos como:
    - docker-compose.yml -> El docker compose que me ejecuta tanto el contenedor de react, como el de symfony y el de mysql.
    - .gitignore -> Archivo donde indico qué no quiero incluir en mi repositorio de github para cuando realizo los commits.
    - tripwme.sql -> Mi base de datos exportada con algunos datos metidos para luego subirla a RDS.
    - manual -> Manual requerido sobre mi proyecto.
