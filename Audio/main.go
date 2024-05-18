package main

import(
	"github.com/gorilla/websocket"
    //"github.com/joho/godotenv"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/gridfs"
    "go.mongodb.org/mongo-driver/mongo/options"
    "github.com/rs/cors"
    "github.com/gorilla/mux"
	"log"
    "io"
    //"strconv"
    "strings"
	"encoding/json"
	//"os"
	"net/http"
    "bytes"
	"time"
	"context"
    //"github.com/go-audio/audio"
	//"github.com/go-audio/wav"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
        return true
    },
}


func renderJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "text/html; charset=ascii")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers","Content-Type,access-control-allow-origin, access-control-allow-headers")
	js, err := json.Marshal(v)
	w.WriteHeader(status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.Write(js)
}



func messageHandler(conn *websocket.Conn, p []byte, messageType int) {
	var resp = string(p) + "!!!"
	if err := conn.WriteMessage(messageType, []byte(resp)); err != nil {
		log.Println(err)
		return
	}
	log.Println("sent: ", string(p))
}

func Websockethandler(w http.ResponseWriter, r *http.Request) {
    conn, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Println(err)
        return
    }
	log.Println("connected : ", r)
	// err = conn.WriteMessage(websocket.TextMessage, []byte("PRIVET!!!!!!!!"))
    for {
		messageType, p, err := conn.ReadMessage()
		if  err != nil {
			log.Println(err)
		}
		log.Println("got: ", string(p))
		go messageHandler(conn, p, messageType)		
	}
}

var DB *mongo.Client = ConnectDB()
var name = "audio"
var opt = options.GridFSBucket().SetName(name)

func EnvMongoURI() string {
	return("mongodb://localhost:27017/MusicLand")
}

// To connect to mongodb
func ConnectDB() *mongo.Client {
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    // mongo.Connect return mongo.Client method
    uri := EnvMongoURI()
    client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
    if err != nil {
        log.Fatal("Error: " + err.Error())
    }

    //ping the database
    err = client.Ping(ctx, nil)
    if err != nil {
        log.Fatal("Error: " + err.Error())
    }
    log.Println("Connected to MongoDB")
    return client
}


func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
    collection := client.Database("musicLand").Collection(collectionName)
    return collection
}

func uploadFile(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodOptions {
        // Если это предварительный запрос OPTIONS - просто возвращаем разрешающие заголовки
        w.WriteHeader(http.StatusOK)
        return
       }
        file, header, err := r.FormFile("audio")
        if err != nil {
            log.Fatal("err reading file: ", err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }
        defer file.Close()

        bucket, err := gridfs.NewBucket(
            DB.Database("musicLand"), opt,
        )
        if err != nil {
            log.Fatal("Erroc connecting: ", err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }

        buf := bytes.NewBuffer(nil)
        if _, err := io.Copy(buf, file); err != nil {
            log.Fatal(err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }

        filename := time.Now().Format(time.RFC3339) + "_" + header.Filename
        uploadStream, err := bucket.OpenUploadStream(
            filename,
        )
        if err != nil {
            log.Fatal("Error uploading to mongoDB: ", err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }
        defer uploadStream.Close()

        fileSize, err := uploadStream.Write(buf.Bytes())
        if err != nil {
            log.Fatal(err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }

        fileId, _ := json.Marshal(uploadStream.FileID)
        if err != nil {
            log.Fatal(err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }
        renderJSON(w, http.StatusOK, map[string]interface{}{"fileId": strings.Trim(string(fileId), `"`), "fileSize": fileSize})
    }


func serveFile(w http.ResponseWriter, r *http.Request){
        //audioIdaudioId := strings.TrimPrefix(r.URL.Path, "/audio/")
        //audioId := r.URL.Query().Get("id")
        
        conn, err := upgrader.Upgrade(w, r, nil)
        if err != nil {
            log.Println("Error upgrading websocket connection:", err)
            return
        }
        defer conn.Close()

        _, audioId, err := conn.ReadMessage()
        if err != nil {
            log.Println("Error reading message:", err)
            return
        }
        
        log.Println(string(audioId))

        objID, err := primitive.ObjectIDFromHex(string(audioId))
        if err != nil {
            log.Fatal("343", err)
            return
        }

        bucket, _ := gridfs.NewBucket(
            DB.Database("musicLand"), opt,
        )

        var buf bytes.Buffer
        dStream, err := bucket.DownloadToStream(objID, &buf)
        if err != nil {
            log.Fatal(err)
            return
        }

        // Читаем и отправляем аудиоданные вебсокетом
    // var chunkSize = 10240

    // audioBytes := buf.Bytes()
    	// Переменная для отслеживания позиции в исходном массиве байт
	// position := 0

	// // Читаем данные по частям из исходного массива и сохраняем их в массив байт ограниченного размера
	// for position < len(audioBytes) {
	// 	bytesToRead := len(audioBytes) - position
	// 	if bytesToRead > chunkSize {
	// 		bytesToRead = chunkSize
	// 	}

    //     chunk := make([]byte, bytesToRead)


    //     err = conn.WriteMessage(websocket.BinaryMessage, encoded)
    //     if err != nil {
    //         log.Println("Error writing to websocket:", err)
    //         return
    //     }
    //     position+=chunkSize
    // }
        log.Printf("File size to download: %v\n", dStream)
        err = conn.WriteMessage(websocket.BinaryMessage, buf.Bytes())

}


func StartServer() {
    r := mux.NewRouter()
	r.HandleFunc("/upload", uploadFile).Methods(http.MethodPost)
    r.HandleFunc("/audio", serveFile).Methods(http.MethodGet)
	http.HandleFunc("/", Websockethandler)
    c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "DELETE", "POST", "PUT"},
	})
	handler := c.Handler(r)
	http.ListenAndServe(":8089", handler)
}

func main() {
	StartServer() 
}