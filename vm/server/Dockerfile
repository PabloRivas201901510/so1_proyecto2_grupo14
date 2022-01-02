FROM node:alpine

WORKDIR /api
COPY package.json .

RUN npm i
COPY . .

EXPOSE 80

CMD [ "npm", "run", "start" ]
