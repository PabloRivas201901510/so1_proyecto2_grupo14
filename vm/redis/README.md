Levantar contenedor de mongodb
docker run -d -p 6379:6379 --name redis redis:alpine redis-server

Entrar al contenedor de docker
docker exec -it redis sh
redis-cli

