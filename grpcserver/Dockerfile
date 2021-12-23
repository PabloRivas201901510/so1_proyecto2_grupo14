FROM golang:1.17

WORKDIR /
COPY . .

RUN go mod download

EXPOSE 50051

CMD ["go", "run", "server.go"]
