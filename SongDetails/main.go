package main


import (
	"log"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"net/http"
	"github.com/gorilla/mux"
	"musicland.com/songdetails/internal/transport"
)

func main() {
	Init()
	r := mux.NewRouter()
	server := songserver.New()
	r.HandleFunc("/songs", server.GetAllSongsHandler).Methods(http.MethodGet)
	r.HandleFunc("/songs", server.CreateSongHandler).Methods(http.MethodPost)
	r.HandleFunc("/songs/{name}", server.GetSongByNameHandler).Methods(http.MethodGet)
	r.HandleFunc("/songs/{id}", server.DeleteSongByIdHandler).Methods(http.MethodDelete)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "DELETE", "POST", "PUT"},
	})
	handler := c.Handler(r)
	http.ListenAndServe(":8088", handler)
}


func Init() {
	// loads values from .env into the system
	if err := godotenv.Load(".env"); err != nil {
		log.Print("No .env file found")
	}
}
