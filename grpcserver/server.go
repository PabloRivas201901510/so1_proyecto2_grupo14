package main

import (
	"context"
	"fmt"
	pb "grpcserver/proto-grpc"
	"log"
	"net"
	"time"

	"github.com/go-redis/redis/v8"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"google.golang.org/grpc"
)

const (
	port = ":50051"
	dir  = "35.230.106.175:6379"
)

var redisClient = redis.NewClient(&redis.Options{
	Addr:     "35.230.106.175:6379",
	Password: "grupo14so1",
})

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
	//------------ MONGO
	ctx, err := context.WithTimeout(context.Background(), 10*time.Second)
	defer err()
	mongoclient, err1 := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://35.230.106.175:27017"))
	if err1 != nil {
		log.Fatal(err)
	}

	datab, err2 := mongoclient.ListDatabaseNames(ctx, bson.M{})
	if err2 != nil {
		log.Fatal(err)
	}

	fmt.Println(datab)

	DataBase := mongoclient.Database("covid")
	Collection := DataBase.Collection("vacundata")

	var bdoc interface{}

	errb := bson.UnmarshalExtJSON([]byte(registro), true, &bdoc)
	fmt.Println(errb)

	insertResult, err6 := Collection.InsertOne(ctx, bdoc)
	if err6 != nil {
		log.Fatal(err)
	}
	fmt.Println(insertResult)

	//------------- REDIS

	/*res, err7 := json.Marshal(bdoc)
	if err7 != nil {
		panic(err7)
	}*/

	if err8 := redisClient.LPush(ctx, "list-vacun-data", registro).Err(); err8 != nil {
		panic(err8)
	}

}

func (s *server) ReturnInfo(ctx context.Context, in *pb.RequestId) (*pb.ReplyInfo, error) {
	arrange(in.GetId())
	fmt.Printf(">> Leido: %v \n", in.GetId())
	return &pb.ReplyInfo{Info: ">> Recibido: " + in.GetId()}, nil
}

func main() {
	fmt.Println("Levantando Server.....")
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
