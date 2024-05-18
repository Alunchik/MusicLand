package songserver

import (
	"musicland.com/songdetails/internal/services"
	"encoding/json"
	"log"
	"mime"
	"fmt"
	"strconv"
	"net/http"
	"github.com/gorilla/mux"
)

type SongServer struct {
	service *songservice.SongService
}

func New() *SongServer {
		service := songservice.New()
		return &SongServer{service: service}
}

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

func (ss *SongServer) CreateSongHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
        // Если это предварительный запрос OPTIONS - просто возвращаем разрешающие заголовки
        w.WriteHeader(http.StatusOK)
        return
       }
	log.Printf("handling song create at %s\n", r.URL.Path)
		type RequestSong struct {
			Title string `json:"title"`
			ArtistId string `json: "artistId"`
			AudioId string `json: "audioId"`
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
		id := ss.service.CreateSong(rs.Title, rs.ArtistId, rs.AudioId)
		renderJSON(w, ResponseId{ID: id})
}

func (ss *SongServer) GetAllSongsHandler(w http.ResponseWriter, req *http.Request) {
		log.Printf("handling get all songs at %s\n", req.URL.Path)
		allSongs := ss.service.GetAllSongs()
		renderJSON(w, allSongs)
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
	

func (ss *SongServer) GetSongByNameHandler(w http.ResponseWriter, req *http.Request) {
		title := req.URL.Query().Get("title")
		log.Printf("handling get songs at %s with name %s\n", req.URL.Path, title)
		song := ss.service.GetSongsByName(title)
		renderJSON(w, song)
	}

func (ss *SongServer) DeleteSongByIdHandler(w http.ResponseWriter, req *http.Request) {
		vars := mux.Vars(req)
		paramId := vars["id"]
		log.Printf("handling delete song at %s with ID %s\n", req.URL.Path, paramId)
		id, e := strconv.Atoi(paramId)
		if(e!=nil) {
			panic(e)
		}
		res := ss.service.DeleteSongById(id)
		renderJSON(w, res)
	}
