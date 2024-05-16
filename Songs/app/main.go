package main


import (
	"encoding/json"
	"log"
	"github.com/joho/godotenv"
	"mime"
	"fmt"
	"strconv"
	//"github.com/gorilla/handlers"
	"github.com/rs/cors"
	//"time"

	"net/http"
	"github.com/gorilla/mux"
	"musicland.com/songs/internal/songstore"
)

type songServer struct {
	store *songstore.SongStore
}

func NewSongServer() *songServer {
	store := songstore.New()
	return &songServer{store: store}
}

// renderJSON renders 'v' as JSON and writes it as a response into w.
func renderJSON(w http.ResponseWriter, v interface{}) {
	w.Header().Set("Content-Type", "text/html; charset=ascii")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers","Content-Type,access-control-allow-origin, access-control-allow-headers")
	js, err := json.Marshal(v)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}

func (ss *songServer) createSongHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("handling song create at %s\n", r.URL.Path)
		type RequestSong struct {
			Title string `json:"title"`
			ArtistID int `json: "artistID"`
		}

		type ResponseId struct {
			ID int `json:"id"`
		}
		contentType := r.Header.Get("Content-Type")
		mediatype, _, err := mime.ParseMediaType(contentType)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if mediatype != "application/json" {
			http.Error(w, "expect application/json Content-Type", http.StatusUnsupportedMediaType)
			return
		}
	
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields()
		var rs RequestSong
		if err := dec.Decode(&rs); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		id := ss.store.CreateSong(rs.Title, rs.ArtistID)
		renderJSON(w, ResponseId{ID: id})
	}

	func (ss *songServer) getAllSongsHandler(w http.ResponseWriter, req *http.Request) {
		log.Printf("handling get all songs at %s\n", req.URL.Path)
		allSongs := ss.store.GetAllSongs()
		renderJSON(w, allSongs)
	}

	

	func (ss *songServer) getSongByNameHandler(w http.ResponseWriter, req *http.Request) {
		title := req.URL.Query().Get("title")
		log.Printf("handling get songs at %s with name %s\n", req.URL.Path, title)
		song := ss.store.GetSongsByName(title)
		renderJSON(w, song)
	}

	func (ss *songServer) DeleteSongByIdHandler(w http.ResponseWriter, req *http.Request) {
		vars := mux.Vars(req)
		paramId := vars["id"]
		log.Printf("handling delete song at %s with ID %s\n", req.URL.Path, paramId)
		id, e := strconv.Atoi(paramId)
		if(e!=nil) {
			panic(e)
		}
		res := ss.store.DeleteSongById(id)
		renderJSON(w, res)
	}

	func init() {
		// loads values from .env into the system
		if err := godotenv.Load(".env"); err != nil {
			log.Print("No .env file found")
		}
	}


	func CORS(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	
			// Set headers
			w.Header().Set("Access-Control-Allow-Headers:", "*")
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "*")
	
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}


			fmt.Println("ok")
	
			// Next
			next.ServeHTTP(w, r)
			return
		})
	}
	
func main() {
	err := godotenv.Load()
	if err != nil {
	  log.Fatal("Error loading .env file")
	}
	r := mux.NewRouter()
	server := NewSongServer()
	r.HandleFunc("/songs", server.getAllSongsHandler).Methods(http.MethodGet)
	r.HandleFunc("/songs", server.createSongHandler).Methods(http.MethodPost)
	r.HandleFunc("/songs/{id}", server.DeleteSongByIdHandler).Methods(http.MethodDelete)
	// srv := &http.Server{
    //     Handler:      r,
    //     Addr:         "localhost:8088",
    //     // Good practice: enforce timeouts for servers you create!
    //     WriteTimeout: 15 * time.Second,
    //     ReadTimeout:  15 * time.Second,
    // }
	// srv.ListenAndServe()

	corsOptions := cors.Options{
		AllowedOrigins:     []string{"*"},
		AllowedMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowedHeaders:     []string{"*"},
		ExposedHeaders:    []string{"*"},
		AllowCredentials: true,
		AllowOriginFunc: func(origin string) bool {
			return origin == "*"
		},
	};
	corsHandler := cors.New(corsOptions).Handler(r)
	http.ListenAndServe(":8088", corsHandler)
}