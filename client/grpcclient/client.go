package main

import (
	pb "clientgrpc/proto-grpc"
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"google.golang.org/grpc"
)

const (
	address = "localhost:50051"
)

func server_conexion(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	datos, _ := ioutil.ReadAll(r.Body)
	conn, err1 := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err1 != nil {
		json.NewEncoder(w).Encode("Error, can not connect to server grpc")
		log.Fatalf("Can't connect to the server(%v)", err1)
	}

	defer conn.Close()

	clie := pb.NewGetInfoClient(conn)

	id := string(datos)
	if len(os.Args) > 1 {
		id = os.Args[1]
	}

	cx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()

	re, err := clie.ReturnInfo(cx, &pb.RequestId{Id: id})
	if err != nil {
		json.NewEncoder(w).Encode("Error, the information cannot be returned.")
		log.Fatalf("Information cannot be returned (%v)", err)
	}

	log.Printf("Server response: %s\n", re.GetInfo())
	json.NewEncoder(w).Encode("The information has been stored")
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", server_conexion)
	fmt.Println("Cliente se levanto en el puerto 8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}
