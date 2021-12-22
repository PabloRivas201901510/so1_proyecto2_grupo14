package main

import (
	"context"
	"fmt"
	pb "grpcserver/proto-grpc"
	"log"
	"net"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"
)

const (
	port = ":50051"
)

type registro struct {
	Name         string `json:"name"`
	Location     string `json:"location"`
	Age          int    `json:"age"`
	Vaccine_type string `json:"vaccine_type"`
	N_dose       int    `json:"n_dose"`
}

/*
"name":"Pablo Mendoza",
"location":"Ciudad Guatemala",
"age":35,
"vaccine_type":"Sputnik V",
"n_dose": 2
*/

type server struct {
	pb.UnimplementedGetInfoServer
}

func arrange(registro string) {
	ctx, err := context.WithTimeout(context.Background(), 10*time.Second)
	defer err()
	mongoclient, err := mongo.Connect(ctx, options.Client().ApplyURI("**ruta de conexión con mongo**"))
	if err != nil {
		log.Fatal(err)
	}

	datab, err := mongoclient.ListDatabaseNames(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(datab)

	DataBase := mongoclient.Database("***** NOMBRE DE LA BASE DE DATOS ****")
	Collection := DataBase.Collection("***** NOMBRE DE LA TABLA ****")

	var bdoc interface{}

	convert := bson.UnmarshalExtJSON([]byte(registro), true, &bdoc)

	fmt.Println(convert)

	insert, err := Collection.InsertOne(ctx, convert)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(insert)
}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	arrange(in.GetId())
	fmt.Printf(">> Leido: %v \n", in.GetId())
	return &pb.ReplyInfo{Info: ">> Recibido: " + in.GetId()}, nil
}

func main() {
	listened, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatal(err)
	}
	ser := grpc.NewServer()
	pb.RegisterGetInfoServer(ser, &server{})
	if err := ser.Serve(listened); err != nil {
		log.Fatal("Error al levantar el servidor \n", err)
	}
}
