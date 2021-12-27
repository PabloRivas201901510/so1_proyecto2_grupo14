package main

import (
	"context"
	"encoding/json"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"
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
	app := fiber.New()

	app.Post("/", func(c *fiber.Ctx) error {
		reg := new(registro)

		if err := c.BodyParser(reg); err != nil {
			panic(err)
		}

		res, err := json.Marshal(reg)
		if err != nil {
			panic(err)
		}

		if err := redisClient.Publish(ctx, "send-vacun-data", res).Err(); err != nil {
			panic(err)
		}

		if err := redisClient.LPush(ctx, "list-vacun-data", res).Err(); err != nil {
			panic(err)
		}

		return c.SendStatus(200)
	})

	app.Listen(":3030")
}
