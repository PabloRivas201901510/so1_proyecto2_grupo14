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
	Addr:     "34.82.25.144:6379",
	Password: "grupo14so1",
})

func main() {
	subscriber := redisClient.Subscribe(ctx, "send-vacun-data")

	reg := registro{}

	for {
		msg, err := subscriber.ReceiveMessage(ctx)
		if err != nil {
			panic(err)
		}

		a := redisClient.LRange(ctx, "list-vacun-data", 0, 4)
		b := redisClient.LLen(ctx, "ninos")
		c := redisClient.LLen(ctx, "adolescentes")
		d := redisClient.LLen(ctx, "jovenes")
		e := redisClient.LLen(ctx, "adultos")
		f := redisClient.LLen(ctx, "vejez")
		for i, s := range a.Val() {
			if err := json.Unmarshal([]byte(s), &reg); err != nil {
				panic(err)
			}
			if i == -1 {
				fmt.Println(i)
				if err := json.Unmarshal([]byte(msg.Payload), &reg); err != nil {
					panic(err)
				}
				fmt.Printf("%+v\n", reg)
			}

			fmt.Printf("%+v\n", reg)
		}
		fmt.Println(b.Val())
		fmt.Println(c.Val())
		fmt.Println(d.Val())
		fmt.Println(e.Val())
		fmt.Println(f.Val())
	}
}
