package main

import (
	"context"
	"encoding/json"

	"time"

	"github.com/go-redis/redis/v8"
	"github.com/gofiber/fiber/v2"

	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
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
	app := fiber.New()

	app.Post("/", func(c *fiber.Ctx) error {
		reg := new(registro)

		if err := c.BodyParser(reg); err != nil {
			panic(err)
		}

		if reg.Age < 11 {
			if err := redisClient.LPush(ctx, "ninos", reg.Age).Err(); err != nil {
				panic(err)
			}
		} else if reg.Age < 19 {
			if err := redisClient.LPush(ctx, "adolescentes", reg.Age).Err(); err != nil {
				panic(err)
			}
		} else if reg.Age < 27 {
			if err := redisClient.LPush(ctx, "jovenes", reg.Age).Err(); err != nil {
				panic(err)
			}
		} else if reg.Age < 59 {
			if err := redisClient.LPush(ctx, "adultos", reg.Age).Err(); err != nil {
				panic(err)
			}
		} else {
			if err := redisClient.LPush(ctx, "vejez", reg.Age).Err(); err != nil {
				panic(err)
			}
		}

		res, err := json.Marshal(reg)
		if err != nil {
			panic(err)
		}

		if err := redisClient.Publish(ctx, "send-vacun-data", res).Err(); err != nil {
			panic(err)
		}

		arrange(string(res))

		if err := redisClient.LPush(ctx, "list-vacun-data", res).Err(); err != nil {
			panic(err)
		}

		return c.SendStatus(200)
	})

	app.Listen(":3030")
}

func arrange(registro string) {
	ctx, err := context.WithTimeout(context.Background(), 10*time.Second)
	defer err()
	mongoclient, err1 := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://www.so1g14.tk:27017"))
	if err1 != nil {
		panic(err)
	}

	datab, err2 := mongoclient.ListDatabaseNames(ctx, bson.M{})
	if err2 != nil {
		panic(err)
	}

	fmt.Println(datab)

	DataBase := mongoclient.Database("covid")
	Collection := DataBase.Collection("vacundata")

	var bdoc interface{}

	errb := bson.UnmarshalExtJSON([]byte(registro), true, &bdoc)
	fmt.Println(errb)

	insertResult, err6 := Collection.InsertOne(ctx, bdoc)
	if err6 != nil {
		panic(err)
	}
	fmt.Println(insertResult)
}
