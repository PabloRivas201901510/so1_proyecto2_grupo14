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
	conn, err := grpc.Dial(address, grpc.WithInsecure(), grpc.WithBlock())
	if err != nil {
		json.NewEncoder(w).Encode("Error, no se puede conectar con el servidor grpc")
		log.Fatalf("No se puede conectar con el server :c (%v)", err)
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
		json.NewEncoder(w).Encode("Error, no  se puede retornar la información.")
		log.Fatalf("No se puede retornar la información :c (%v)", err)
	}

	log.Printf("Respuesta del server: %s\n", re.GetInfo())
	json.NewEncoder(w).Encode("Se ha almacenado la información")
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/", server_conexion)
	fmt.Println("Cliente se levanto en el puerto 8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}
