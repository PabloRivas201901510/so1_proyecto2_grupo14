FROM node:14-alpine as build-step

WORKDIR /app
COPY package.json .

RUN npm i
COPY . .

RUN npm run build --prod

FROM nginx:1.17.1-alpine
COPY --from=build-step /app/docs /usr/share/nginx/html
