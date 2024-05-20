package main

import (
	"log"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"net/http"
	"github.com/gorilla/mux"
	"musicland.com/songdetails/internal/transport/songserver"
	"musicland.com/songdetails/internal/transport/commentserver"
	"musicland.com/songdetails/internal/transport/config"
)


func Init() {
	// loads values from .env into the system
	if err := godotenv.Load(".env"); err != nil {
		log.Print("No .env file found")
	}
}

func main() {
	Init()
	r := mux.NewRouter()
	songserver := songserver.NewSongServer()
	commentserver := commentserver.NewCommentServer()
	r.HandleFunc("/songs", songserver.GetAllSongsHandler).Methods(http.MethodGet)
	r.HandleFunc("/songs", config.AuthMiddleware(songserver.CreateSongHandler)).Methods(http.MethodPost)
	// r.HandleFunc("/songs", AuthMiddleware(songserver.UpdateSongHandler)).Methods(http.MethodUpdate)
	r.HandleFunc("/songs/byUser", config.AuthMiddleware(songserver.GetSongByNameHandler)).Methods(http.MethodGet)
	r.HandleFunc("/comments", commentserver.GetCommentBySongIdHandler).Methods(http.MethodGet)
	r.HandleFunc("/comments", config.AuthMiddleware(commentserver.CreateCommentHandler)).Methods(http.MethodPost)
	// r.HandleFunc("/comments", config.AuthMiddleware(commentserver.UpdateCommentHandler)).Methods(http.MethodUpdate)
	r.HandleFunc("/admin/songs", config.AdminMiddleware(songserver.DeleteSongByIdHandler)).Methods(http.MethodDelete)
	r.HandleFunc("/admin/comments", config.AdminMiddleware(commentserver.DeleteCommentByIdHandler)).Methods(http.MethodDelete)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedHeaders: []string{"*"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "DELETE", "POST", "PUT"},
	})
	handler := c.Handler(r)
	http.ListenAndServe(":8088", handler)
}


