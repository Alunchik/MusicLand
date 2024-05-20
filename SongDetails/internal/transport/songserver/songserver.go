package songserver
import(
	"musicland.com/songdetails/internal/services/songservice"
	"musicland.com/songdetails/internal/transport/config"
	"encoding/json"
	"log"
	"strconv"
	"net/http"
	"mime"
)

type SongServer struct {
	service *songservice.SongService
}

func NewSongServer() *SongServer {
		service := songservice.New()
		return &SongServer{service: service}
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
		config.RenderJSON(w, ResponseId{ID: id})
}

func (ss *SongServer) GetAllSongsHandler(w http.ResponseWriter, req *http.Request) {
		log.Printf("handling get all songs at %s\n", req.URL.Path)
		allSongs := ss.service.GetAllSongs()
		config.RenderJSON(w, allSongs)
	}

	func (ss *SongServer) GetSongByNameHandler(w http.ResponseWriter, req *http.Request) {
		title := req.URL.Query().Get("title")
		log.Printf("handling get songs at %s with name %s\n", req.URL.Path, title)
		song := ss.service.GetSongsByName(title)
		config.RenderJSON(w, song)
	}


func (ss *SongServer) DeleteSongByIdHandler(w http.ResponseWriter, req *http.Request) {
	idstr := req.URL.Query().Get("id")
		log.Printf("handling delete song at %s with ID %s\n", req.URL.Path, idstr)
		id, e := strconv.Atoi(idstr)
		if(e!=nil) {
			panic(e)
		}
		res := ss.service.DeleteSongById(id)
		config.RenderJSON(w, res)
	}