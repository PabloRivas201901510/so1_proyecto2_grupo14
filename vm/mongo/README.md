Levantar contenedor de mongodb
docker run -d -p 27017:27017 --name mongodb mongo

Entrar al contenedor de docker
docker exec -it mongodb bash
mongo

