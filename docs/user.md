# Manual de Usuario
## Universidad de San Carlos de Guatemala
### Facultad de Ingeniería
### Escuela de Ciencias y Sistemas
### Sistemas Operativos 1
#### Escuela de Vacaciones de Diciembre 2021

- [Manual de Usuario](#manual-de-usuario)
  - [Universidad de San Carlos de Guatemala](#universidad-de-san-carlos-de-guatemala)
    - [Facultad de Ingeniería](#facultad-de-ingeniería)
    - [Escuela de Ciencias y Sistemas](#escuela-de-ciencias-y-sistemas)
    - [Sistemas Operativos 1](#sistemas-operativos-1)
      - [Escuela de Vacaciones de Diciembre 2021](#escuela-de-vacaciones-de-diciembre-2021)
  - [Glosario](#glosario)
  - [Descripcion General](#descripcion-general)
  - [Uso](#uso)
    - [Locust](#locust)
    - [Division de Trafico](#division-de-trafico)
    - [MongoDB](#mongodb)
    - [Redis](#redis)
    - [Servidor](#servidor)
    - [Cliente](#cliente)
      - [Servidor de desarrollo](#servidor-de-desarrollo)
      - [Ayuda adicional](#ayuda-adicional)

## Glosario
| Término | Definición                                                           |
| ------- | -------------------------------------------------------------------- |
| `SO`    | Una aplicación que permite la ejecución de programas en un ordenador |
| `Linux` | Sistemas Operativos basados en el kernel Linux                       |
| `GCP`   | Google Cloud Platform                                                |
| `VM`    | Máquina virtual                                                      |
| `K8S`   | Kubernetes                                                           |

## Descripcion General
Este proyecto consiste en arquitectura de sistema distribuida genérica que muestre estadísticas en tiempo real mediante Kubernetes y tecnologías nativas en la
nube. Y proporcionar un despliegue blue/green, Canary o división de tráfico. Este proyecto será aplicado para llevar el control sobre el porcentaje de personas vacunadas contra el de COVID-19 en todo en Guatemala.

## Uso
La máquina virtual está alojada en GCP bajo la dirección www.so1g14.tk. La VM tiene varios contenedores, accesibles mediante distintos puertos.
### Locust 
Para el uso de locust se utiliza el siguiente comando:
```
npm start

```
La ejecucion proviene de un mini-servicio en nodejs. Esta parte es local asi que se ejecuta desde la carpeta destino.

Este archivo se corre localmente y el contenido distribuido viene de una lista de json con la siguiente estructura
```sh
[
  {
    "name":"Pablo Mendoza",
    "location":"Ciudad Guatemala",
    "age":35,
    "vaccine_type":"Sputnik V",
    "n_dose": 2
  },
  …
] 

```

### Division de Trafico
Para la división de tráfico en el proyecto se utilizo Linkerd con la idea de dividir el 50% de tráfico a la primera ruta de acceso y el otro 50% a la segunda ruta de acceso. Para implementar este Linkerd se utilizo un servicio ficticio que es la copia del servicio de una de las rutas, y se utiliza Nginx para esta funcionalidad.

Primera ruta de acceso:
```
1. Generador de Tráfico
2. Ingress
3. go-grpc-client
4. go-grpc-server
5. Escribir en la base de datos NoSQL
```
```
Segunda ruta de acceso:
1. Generador de Tráfico
2. Ingress
3. redis-pub
4. redis-sub
5. Escribir en la base de datos NoSQL
```

### MongoDB
Levantado en la dirección www.so1g14.tk:27017.

Levantar contenedor de mongodb 
```
docker run -d -p 27017:27017 --name mongodb mongo
```

Entrar al contenedor de docker 
```
docker exec -it mongodb bash mongo
```

### Redis
Levantado en la dirección www.so1g14.tk:6379.

Levantar contenedor de redis 
```
docker run -d -p 6379:6379 --name redis redis:alpine redis-server
```

Entrar al contenedor de docker 
```
docker exec -it redis sh redis-cli
```

### Servidor
Levantado en la dirección www.so1g14.tk:8080.

Levantar contenedor del servidor 
```
docker run -d -p 6379:6379 --name redis redis:alpine redis-server
```
Entrar al contenedor de docker 
```
docker exec -it redis sh redis-cli
```

### Cliente
Levantado en la dirección www.so1g14.tk:80.

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) version 11.2.6.

#### Servidor de desarrollo

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


#### Ayuda adicional

Para obtener más ayuda en Angular CLI, use `ng help` o consulte la pagina [Angular CLI Overview and Command Reference](https://angular.io/cli).



