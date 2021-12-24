package main

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/go-redis/redis/v8"
)

type registro struct {
	Name         string `json:"name"`
	Location     string `json:"location"`
	Age          int    `json:"age"`
	Vaccine_type string `json:"vaccine_type"`
	N_dose       int    `json:"n_dose"`
}

var ctx = context.Background()

var redisClient = redis.NewClient(&redis.Options{
	Addr: "localhost:6379",
})

func main() {
	subscriber := redisClient.Subscribe(ctx, "send-vacun-data")

	reg := registro{}

	for {
		msg, err := subscriber.ReceiveMessage(ctx)
		if err != nil {
			panic(err)
		}

		if err := json.Unmarshal([]byte(msg.Payload), &reg); err != nil {
			panic(err)
		}

		fmt.Println("Received - " + msg.Channel + " channel.")
		fmt.Printf("%+v\n", reg)
	}
}
