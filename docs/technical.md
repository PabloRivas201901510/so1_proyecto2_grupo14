# Manual Técnico
## Universidad de San Carlos de Guatemala
### Facultad de Ingeniería
### Escuela de Ciencias y Sistemas
### Sistemas Operativos 1
#### Escuela de Vacaciones de Diciembre 2021

- [Manual Técnico](#manual-técnico)
  - [Universidad de San Carlos de Guatemala](#universidad-de-san-carlos-de-guatemala)
    - [Facultad de Ingeniería](#facultad-de-ingeniería)
    - [Escuela de Ciencias y Sistemas](#escuela-de-ciencias-y-sistemas)
    - [Sistemas Operativos 1](#sistemas-operativos-1)
      - [Escuela de Vacaciones de Diciembre 2021](#escuela-de-vacaciones-de-diciembre-2021)
  - [Glosario](#glosario)
  - [Máquina Virtual](#máquina-virtual)
    - [Contratación de una VM en GCP](#contratación-de-una-vm-en-gcp)
    - [Instalación de Docker en la VM](#instalación-de-docker-en-la-vm)
    - [Implementación de una base de datos Mongo en Docker](#implementación-de-una-base-de-datos-mongo-en-docker)
    - [Implementación de una base de datos Redis en Docker](#implementación-de-una-base-de-datos-redis-en-docker)
    - [Creación de un servidor web en Docker](#creación-de-un-servidor-web-en-docker)
    - [Creación de un cliente web en Docker](#creación-de-un-cliente-web-en-docker)
    - [Implementación de imágenes Docker en la máquina virtual](#implementación-de-imágenes-docker-en-la-máquina-virtual)
  - [Clúster de Kubernetes](#clúster-de-kubernetes)
    - [Creacion de cluster de kubernetes](#creacion-de-cluster-de-kubernetes)
    - [Configuracion en Google Cloud Platform](configuracion-en-google-cloud-platform)
    - [Instalación de Linker](instalación-de-linker)
    - [Instalación del dashboard](Iinstalación-del-dashboard])
    - [Instalacion de Helm](instalacion-de-helm)
    - [Instalar el Ingress](instalar-el-ingress)
    - [Configurar el Ingress](configurar-el-ingress)
    - [Optenemos IP Externa](optenemos-ip-externa)
    - [Crear Subdominio](crear-subdominio)
    - [Ejecuta el archivo yaml](ejecuta-el-archivo-yaml)
    - [Ver el Dashboard](ver-el-dashboard)
  - [Redis](#redis)
    - [Redis Pub](#redis-pub)

## Glosario
| Término | Definición                                                           |
| ------- | -------------------------------------------------------------------- |
| `SO`    | Una aplicación que permite la ejecución de programas en un ordenador |
| `Linux` | Sistemas Operativos basados en el kernel Linux                       |
| `GCP`   | Google Cloud Platform                                                |
| `VM`    | Máquina virtual                                                      |
| `K8S`   | Kubernetes                                                           |

## Máquina Virtual
### Contratación de una VM en GCP
Documentación oficial en [GCP](https://cloud.google.com/compute/docs/instances/creating-instance).

### Instalación de Docker en la VM
Se puede instalar Docker en la VM utilizando el siguiente comando:
```sh
sudo apt-get update
sudo apt-get install -y docker.io
```

Para verificar que Docker se instaló correctamente se puede ejecutar el siguiente comando:
```sh
sudo systemctl status docker
```

### Implementación de una base de datos Mongo en Docker
Se puede implementar una base de datos Mongo en Docker utilizando el siguiente comando:
```sh
sudo docker run -d -p 27017:27017 --name mongo mongo
```

El anterior comando crea un contenedor de Docker que se ejecuta en el puerto 27017, utilizando la imagen mongo:latest. Si la imagen no se encuentra descargada en el sistema, se descargará automáticamente.

### Implementación de una base de datos Redis en Docker
Se puede implementar una base de datos Redis en Docker utilizando el siguiente comando:
```sh
sudo docker run -d -p 6379:6379 --name redis redis
```

El anterior comando crea un contenedor de Docker que se ejecuta en el puerto 6379, utilizando la imagen redis:latest. Si la imagen no se encuentra descargada en el sistema, se descargará automáticamente.

### Creación de un servidor web en Docker
Para crear una imagen debemos crear un directorio para esta con un archivo llamado Dockerfile. Este archivo contiene las instrucciones detalladas para crear la imagen en cualquier entorno sin ninguna dependencia.

Suponiendo que se requiere crear un servidor web en Node.JS, se puede iniciar el Dockerfile con las siguientes instrucciones:
```Dockerfile
FROM node:latest

WORKDIR /server
COPY package.json .

RUN npm i
COPY . .

EXPOSE 8080

CMD [ "npm", "run", "start" ]
```

Las instrucciones de arriba son las siguientes:
- `FROM node:latest`: Especifica node:latest como imagen base para la que se creará la imagen.
- `WORKDIR /server`: Especifica que el directorio /server será el directorio de trabajo del contenedor.
- `COPY package.json .`: Copia el archivo package.json al directorio actual.
- `RUN npm i`: Ejecuta el comando npm i para instalar las dependencias.
- `COPY . .`: Copia el código fuente al directorio actual.
- `EXPOSE 8080`: Especifica que el puerto 8080 será abierto en el contenedor.
- `CMD [ "npm", "run", "start" ]`: Especifica que el comando npm run start será ejecutado al iniciar el contenedor. Este comando debe ser especificado en el package.json.

Una vez que se haya creado el Dockerfile, se puede ejecutar el siguiente comando para crear la imagen:
```sh
sudo docker build -t server .
```

Con dicha imagen creada, se puede ejecutar el siguiente comando para crear un contenedor:
```sh
sudo docker run -d -p 8080:8080 --name server server
```

Al final, se puede ejecutar el comando `sudo docker ps` para verificar que el contenedor se ha iniciado correctamente.

### Creación de un cliente web en Docker
El Dockefile para el cliente web se podría crear de la siguiente manera:
```Dockerfile
FROM node:alpine as build-step

WORKDIR /client
COPY package.json .

RUN npm i
COPY . .

RUN npm run build --prod

FROM nginx:alpine
COPY --from=build-step /client/dist/client /usr/share/nginx/html
```

Las instrucciones de arriba son las siguientes:
- `FROM node:alpine as build-step`: Especifica node:alpine como imagen base para la que se creará la imagen.
- `WORKDIR /client`: Especifica que el directorio /client será el directorio de trabajo del contenedor.
- `COPY package.json .`: Copia el archivo package.json al directorio actual.
- `RUN npm i`: Ejecuta el comando npm i para instalar las dependencias.
- `COPY . .`: Copia el código fuente al directorio actual.
- `RUN npm run build --prod`: Ejecuta el comando npm run build --prod para generar los estáticos del cliente.
- `FROM nginx:alpine`: Utiliza ahora la imagen nginx:alpine como imagen base para el contenedor.
- `COPY --from=build-step /client/dist/client /usr/share/nginx/html`: Copia los estáticos al directorio /usr/share/nginx/html, donde serán servidos por nginx.

Una vez que se haya creado el Dockerfile, se puede ejecutar el siguiente comando para crear la imagen:
```sh
sudo docker build -t client .
```

Con dicha imagen creada, se puede ejecutar el siguiente comando para crear un contenedor:
```sh
docker run -d -p 80:80 --name client client
```

Al final, se puede ejecutar el comando `sudo docker ps` para verificar que el contenedor se ha iniciado correctamente.

### Implementación de imágenes Docker en la máquina virtual
Debido a que las pruebas de las imágenes Docker se realizan en una máquina local, se puede publicar las imágenes Docker en un repositorio remoto.

Para poder publicar una imagen Docker en una librería de imágenes como Dockerhub, primero debemos contar con una cuenta en dicho sitio, y luego crear un repositorio para alojar la imagen.

En Dockerhub se pueden publicar imágenes creadas con el comando `docker build`, siempre cuidando el tag con el que se crea, pues debe coincidir con el tag de la imagen en el repositorio remoto. La imagen creada se puede commitear con el comando `docker commit`, y luego publicarse con el comando `docker push`.

Por último, se debe ejecutar `docker pull` con el repositorio que aloja la imagen, para descargar la imagen de Dockerhub en la máquina virtual. De esta forma, se pueden crear contenedores con la imagen descargada.

## Clúster de Kubernetes

Para la instalcion de un cluster de kubernetes se utilizaron los siguientes pasos:

### Creacion de cluster de kubernetes
```
gcloud container clusters create k8s-demo --num-nodes=1 --tags=allin,allout --enable-legacy-authorization --issue-client-certificate --preemptible --machine-type=n1-standard-2

#Nombre del cluster: k8s-demo
#Numero de nodos(1): --num-nodes=1
#Tipo de VM (2 CPUs, 8GB RAM): --machine-type=n1-standard-2
#Nota: Requerimientos minimos 2 CPUs y 4GB RAM, y 3 nodos
#Networks rules (allin, allout): --tags=allin,allout
#Autenticacion con certificado: --enable-legacy-authorization --issue-client-certificate
#Habilitar el escalado automatico (Minimo de nodos 1 y maximo 3): --enable-autoscaling --min-nodes=1 --max-nodes=3
```

### Configuracion en Google Cloud Platform
Se dirige a su cuenta de google cloud
```
#Kubernetes Engine
#Clusteres
#Accede al cluster con el nombre escogido
#En la parte superior izquierda, seleccione 'consola'
#Copia y ejecuta el primer link de gncloud para vincular el proyecto
```
### Instalación de Linker
Acontinuacion se ve el proceso para la instalacion de linkerd
```
curl -fsL https://run.linkerd.io/install | sh
export PATH=$PATH:$HOME/.linkerd2/bin
linkerd check --pre
linkerd install | kubectl apply -f -
```

### Instalación del dashboard
Se instala el dashboard para acceder a la pagina de linkerd
```
linkerd viz install | kubectl apply -f -
```
### Instalacion de Helm
El administrador de paquetes de kubernetes
```
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

### Instalar el Ingress

```
helm repo add stable https://charts.helm.sh/stable
kubectl create namespace nginx-ingress
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install nginx-ingress ingress-nginx/ingress-nginx -n nginx-ingress
helm list -n nginx-ingress
```
### Configurar el Ingress
```
kubectl get all -n nginx-ingress
```

### Optenemos IP Externa
Obtenemos la IP externa por donde ingresan los datos
```
kubectl get svc -n nginx-ingress
```

### Crear Subdominio
Acontinuacion se crea el dominio en el google cloud platform
```
# Seleccione Servicios de Red
# Seleccione la opcion de Cloud DNS
# Crea una nueva zona
# Inserta la IP generada anteriormente
```

### Ejecuta el archivo yaml
Se ejecuta el archivo run.yalm para proceder a realizar la inyeccion del mismo
```
kubectl create -f run.yaml

#Inyectar namespace
kubectl -n project get deploy -o yaml | linkerd inject - | kubectl apply -f -

#OPCIONALES
## Ver namespaces
kubectl get namespaces

## Eliminar Namespace
kubectl delete namespace project
```

### Ver el Dashboard
Finalmente abrimos el dasboar para comprobar que funcionen todos los nodos
```
linkerd viz dashboard
```

## Redis

### Redis Pub
El dockerfile para nuestro Redis Pub seria como el siguiente:
```Dockerfile
# syntax=docker/dockerfile:1

FROM golang:1.17-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

EXPOSE 3030

CMD ["go", "run", ["nombre de archivo GO"]]
```

Las instrucciones de arriba son las siguientes:
- `FROM golang:1.17-alpine`: Especifica golang:1.17-alpine como imagen base para la que se creará la imagen.
- `WORKDIR /app`: Especifica que el directorio /app será el directorio de trabajo del contenedor.
- `COPY go.mod ./`: Copia el archivo go.mod al directorio actual.
- `COPY go.sum ./`: Copia el archivo go.mod al directorio actual.
- `RUN go mod download`: Ejecuta el comando npm i para instalar las dependencias.
- `COPY *.go ./`: Copia el código fuente al directorio actual.
- `EXPOSE 3030`: Expone el puerto 3030 para nuestro Pub.
- `CMD ["go", "run", ["nombre de archivo GO"]]`: Ejecuta el codigo fuente de nuestro pub en el contenedor.

Una vez que se haya creado el Dockerfile, se puede ejecutar el siguiente comando para crear la imagen:
```sh
sudo docker build -t [usuarioRepo]/redispub .
```

Con dicha imagen creada, se puede ejecutar el siguiente comando para crear un contenedor:
```sh
docker run -d -p 80:80 --name redispub redispub
```
### Redis Sub
El dockerfile para nuestro Redis Sub seria como el siguiente:
```Dockerfile
FROM golang:1.17 as build-env

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN CGO_ENABLED=0 go build -o /go/bin/app

FROM gcr.io/distroless/static

COPY --from=build-env /go/bin/app /

CMD ["go", "run", ["nombre de archivo GO"]]
```

Las instrucciones de arriba son las siguientes:
- `FROM golang:1.17 as build-env`: Especifica golang:1.17 como imagen base para la que se creará la imagen.
- `WORKDIR /app`: Especifica que el directorio /app será el directorio de trabajo del contenedor.
- `COPY go.mod ./`: Copia el archivo go.mod al directorio actual.
- `COPY go.sum ./`: Copia el archivo go.mod al directorio actual.
- `RUN go mod download`: Ejecuta el comando npm i para instalar las dependencias.
- `COPY *.go ./`: Copia el código fuente al directorio actual.
- `CMD ["go", "run", ["nombre de archivo GO"]]`: Ejecuta el codigo fuente de nuestro pub en el contenedor.

Una vez que se haya creado el Dockerfile, se puede ejecutar el siguiente comando para crear la imagen:
```sh
sudo docker build -t [usuarioRepo]/redissub .
```

Con dicha imagen creada, se puede ejecutar el siguiente comando para crear un contenedor:
```sh
docker run -d -p 80:80 --name redissub redissub
```
