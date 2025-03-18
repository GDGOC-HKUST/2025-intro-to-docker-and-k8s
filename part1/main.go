package main

import (
	"embed"
	"fmt"
	"log"
	"net/http"
)

var content embed.FS

func main() {
	const port = ":8080"
	const root = "./static"

	http.Handle("/", http.FileServer(http.Dir(root)))

	fmt.Printf("Server started at: %s", "http://localhost"+port)

	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
