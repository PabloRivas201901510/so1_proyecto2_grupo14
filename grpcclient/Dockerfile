FROM golang:1.17-alpine

COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY *.go ./

FROM gcr.io/distroless/static

EXPOSE 8000

CMD ["go", "run", "client.go"]
