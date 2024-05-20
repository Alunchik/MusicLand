package commentserver
import(
	"musicland.com/songdetails/internal/services/commentservice"
	"encoding/json"
	"musicland.com/songdetails/internal/transport/config"
	"log"
	"net/http"
	"mime"
	"strconv"

)

type CommentServer struct {
	service *commentservice.CommentService
}

func NewCommentServer() *CommentServer {
		service := commentservice.New()
		return &CommentServer{service: service}
}

func (ss *CommentServer) CreateCommentHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
        // Если это предварительный запрос OPTIONS - просто возвращаем разрешающие заголовки
        w.WriteHeader(http.StatusOK)
        return
       }
	log.Printf("handling comment create at %s\n", r.URL.Path)
		type RequestComment struct {
			Text string `json:"text"`
			AuthorId string `json: "authorId"`
			SongId string `json: "songId"`
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
		var rs RequestComment
		if err := dec.Decode(&rs); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		id := ss.service.CreateComment(rs.Text, rs.AuthorId, rs.SongId)
		config.RenderJSON(w, ResponseId{ID: id})
}

func (ss *CommentServer) GetAllCommentsHandler(w http.ResponseWriter, req *http.Request) {
		log.Printf("handling get all comments at %s\n", req.URL.Path)
		allComments := ss.service.GetAllComments()
		config.RenderJSON(w, allComments)
	}

	func (ss *CommentServer) GetCommentBySongIdHandler(w http.ResponseWriter, req *http.Request) {
		songId := req.URL.Query().Get("songId")
		log.Printf("handling get comments at %s with name %s\n", req.URL.Path, songId)
		id, e := strconv.Atoi(songId)
		if(e!=nil) {
			http.Error(w, e.Error(), http.StatusBadRequest)
		}
		comment := ss.service.GetCommentsBySongId(id)
		config.RenderJSON(w, comment)
	}

func (ss *CommentServer) DeleteCommentByIdHandler(w http.ResponseWriter, req *http.Request) {
		idstr := req.URL.Query().Get("id")
		log.Printf("handling delete comment at %s with ID %s\n", req.URL.Path, idstr)
		id, e := strconv.Atoi(idstr)
		if(e!=nil) {
			http.Error(w, e.Error(), http.StatusBadRequest)
		}
		res := ss.service.DeleteCommentById(id)
		config.RenderJSON(w, res)
	}