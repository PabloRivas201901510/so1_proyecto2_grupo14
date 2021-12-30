FROM node:alpine

WORKDIR /api
COPY package*.json ./

RUN npm i
COPY . .

EXPOSE 8080

CMD [ "npm", "run", "start" ]
