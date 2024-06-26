package main

import(
	"github.com/gorilla/websocket"
    // "github.com/go-audio/wav"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/gridfs"
    "go.mongodb.org/mongo-driver/mongo/options"
    // "github.com/go-audio/audio"
    "github.com/rs/cors"
    "github.com/gorilla/mux"
	"log"
    "io"
    "strings"
	"encoding/json"
	"net/http"
    "bytes"
	"time"
	"context"
)

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
        log.Println("Error: " + err.Error())
    }

    //ping the database
    err = client.Ping(ctx, nil)
    if err != nil {
        log.Println("Error: " + err.Error())
    }
    log.Println("Connected to MongoDB")
    return client
}


func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
    collection := client.Database("musicLand").Collection(collectionName)
    return collection
}

func DeleteSong(id string, isAdmin bool, login string) error {
    fileIDObj, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        return err
    }
    bucket, err := gridfs.NewBucket(
        DB.Database("musicLand"), opt,
    )
    if err != nil {
        return err
    }
    //проверяем, можно ли данному пользователю удалять песню (он ли ее загрузил)
    // if(isAdmin == false){
    //     fileID := bson.M{"_id": id}
    //     cursor, err := bucket.Find(fileID)
    //     if err != nil {
    //      return err
    //     }
    //     defer func() {
    //         if err := cursor.Close(context.TODO()); err != nil {
    //             log.Println(err)
    //         }
    //     }()
    //     type gridfsFile struct {
    //         Name   string `bson:"filename"`
    //         Length int64  `bson:"length"`
    //     }
    //     var foundFiles []gridfsFile
    //     if err = cursor.All(context.TODO(), &foundFiles); err != nil {
    //         log.Println(err)
    //     }
        
    //    // Извлечение имени файла из метаданных
    //     filename := foundFiles[0].Name

    //     substrings := strings.Split(filename, "_")

    //     author := substrings[1]

    //     if !(login == author) {
    //         return errors.New("Attemt to delete song by user who is not author")
    //     }
    //    }

    err = bucket.Delete(fileIDObj)
    if err != nil {
        return err
    }
    return nil
}

func adminDeleteSong(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodOptions {
        // Если это предварительный запрос OPTIONS - просто возвращаем разрешающие заголовки
        w.WriteHeader(http.StatusOK)
        return
    }
    id := r.URL.Query().Get("id")
   err := DeleteSong(id, true, "")
   if(err!=nil){
    renderJSON(w, http.StatusInternalServerError, err.Error())
    return
   }
    w.WriteHeader(http.StatusOK)
}

// func userDeleteSong(w http.ResponseWriter, r *http.Request) {
//     if r.Method == http.MethodOptions {
//         // Если это предварительный запрос OPTIONS - просто возвращаем разрешающие заголовки
//         w.WriteHeader(http.StatusOK)
//         return
//     }
//     tokenString := r.Header.Get("Authorization")
//     token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
//         return secretKey, nil
// 		})
//     claims := token.Claims.(*CustomClaims)
//     login := claims.Login
//     id := r.URL.Query().Get("id")
//      err = DeleteSong(id, false, login)
//    if(err!=nil){
//     renderJSON(w, http.StatusInternalServerError, err.Error())
//     return
//    }
//     w.WriteHeader(http.StatusOK)
// }

func uploadFile(w http.ResponseWriter, r *http.Request) {
    if r.Method == http.MethodOptions {
        // Если это предварительный запрос OPTIONS - просто возвращаем разрешающие заголовки
        w.WriteHeader(http.StatusOK)
        return
       }
        file, header, err := r.FormFile("audio")
        login:= r.URL.Query().Get("login")
        if err != nil {
            log.Println("err reading file: ", err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }
        defer file.Close()

        bucket, err := gridfs.NewBucket(
            DB.Database("musicLand"), opt,
        )
        if err != nil {
            log.Println("Erroc connecting: ", err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }

        buf := bytes.NewBuffer(nil)
        if _, err := io.Copy(buf, file); err != nil {
            log.Println(err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }

        filename := time.Now().Format(time.RFC3339) + "_" + login + "_" + header.Filename
        uploadStream, err := bucket.OpenUploadStream(
            filename,
        )
        if err != nil {
            log.Println("Error uploading to mongoDB: ", err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }
        defer uploadStream.Close()

        fileSize, err := uploadStream.Write(buf.Bytes())
        if err != nil {
            log.Println(err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }

        fileId, _ := json.Marshal(uploadStream.FileID)
        if err != nil {
            log.Println(err)
            renderJSON(w, http.StatusBadRequest, err.Error())
            return
        }
        renderJSON(w, http.StatusOK, map[string]interface{}{"fileId": strings.Trim(string(fileId), `"`), "fileSize": fileSize})
    }


func serveFile(w http.ResponseWriter, r *http.Request){

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
        
        objID, err := primitive.ObjectIDFromHex(string(audioId))
        if err != nil {
            log.Println("Error getting ID: ", err)
            return
        }

        bucket, _ := gridfs.NewBucket(
            DB.Database("musicLand"), opt,
        )
        var buf bytes.Buffer

        _, err = bucket.DownloadToStream(objID, &buf)
        if err != nil {
            log.Println("Error downloading file: ", err)
            return
        }
        err = conn.WriteMessage(websocket.BinaryMessage, buf.Bytes())
    // reader := bytes.NewReader(buf.Bytes())

    // d := wav.NewDecoder(reader)
    // PCMbuf, err := d.FullPCMBuffer()
    // if err != nil {
	//     panic(err)
    // }
    // out := &BufWriter{}
    // Читаем и отправляем аудиоданные вебсокетом
   // var chunkSize = 1024
    // audioBytes := PCMbuf.Data;
            // chunkBuf := &audio.IntBuffer{}
        // chunkBuf.Format=PCMbuf.Format
        // chunkBuf.SourceBitDepth = PCMbuf.SourceBitDepth
        // chunkBuf.Data = chunk
    // Переменная для отслеживания позиции в исходном массиве байт
	//position := 0
    // e := wav.NewEncoder(out,
    //     PCMbuf.Format.SampleRate,
    //     int(d.BitDepth),
    //     PCMbuf.Format.NumChannels,
    //     int(d.WavAudioFormat))
    // if err = e.Write(PCMbuf); err != nil {
    //     log.Println(err)
    // }
	// Читаем данные по частям из исходного массива и сохраняем их в массив байт ограниченного размера
	// for position < len(audioBytes) {
	// 	bytesToRead := len(audioBytes) - position
	// 	if bytesToRead > chunkSize {
	// 		bytesToRead = chunkSize
	// 	}

    //     chunk := make([]int, bytesToRead)

    //     copy(chunk, audioBytes[position:position+bytesToRead])

    //     out := &BufWriter{}

        // chunkBuf := &audio.IntBuffer{}
        // chunkBuf.Format=PCMbuf.Format
        // chunkBuf.SourceBitDepth = PCMbuf.SourceBitDepth
        // chunkBuf.Data = chunk

    //     e := wav.NewEncoder(out,
    //         PCMbuf.Format.SampleRate,
    //         int(d.BitDepth),
    //         PCMbuf.Format.NumChannels,
    //         int(d.WavAudioFormat))
    //     if err = e.Write(chunkBuf); err != nil {
    //         panic(err)
    //     }

    //    err = conn.WriteMessage(websocket.BinaryMessage, out.buf)
    //    position+=chunkSize
    // }

    //     err = conn.WriteMessage(websocket.BinaryMessage, encoded)
    //     if err != nil {
    //         log.Println("Error writing to websocket:", err)
    //         return
    //     }
    // }
        // log.Printf("File size to download: %v\n", dStream)
        // err = conn.WriteMessage(websocket.BinaryMessage, buf.Bytes())

}




func StartServer() {
    r := mux.NewRouter()
    r.HandleFunc("/admin/delete", AdminMiddleware(adminDeleteSong)).Methods(http.MethodDelete)
    // r.HandleFunc("/delete", authMiddleware(userDeleteSong)).Methods(http.MethodDelete)
	r.HandleFunc("/upload", AuthMiddleware(uploadFile)).Methods(http.MethodPost)
    r.HandleFunc("/audio", serveFile).Methods(http.MethodGet)
	http.HandleFunc("/", Websockethandler)
    c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
        AllowedHeaders: []string{"*"},
		AllowedMethods:   []string{"GET", "DELETE", "POST", "PUT"},
	})
	handler := c.Handler(r)
	http.ListenAndServe(":8089", handler)
}

func main() {
	StartServer() 
}