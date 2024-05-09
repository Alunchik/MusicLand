package main

import(
	"github.com/gorilla/websocket"
	//"github.com/rs/cors"
	"log"
	"net/http"
	//"github.com/gorilla/mux"
)

var upgrader = websocket.Upgrader{
    ReadBufferSize:  1024,
    WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

func messageHandler(conn *websocket.Conn, p []byte, messageType int) {
	var resp = string(p) + "!!!"
	if err := conn.WriteMessage(messageType, []byte(resp)); err != nil {
		log.Println(err)
		return
	}
	log.Println("sent: ", string(p))
}

func handler(w http.ResponseWriter, r *http.Request) {
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

func main() {
	log.Println("A")
	//r := mux.NewRouter()
	http.HandleFunc("/", handler)
	log.Println("B")
	// corsOptions := cors.Options{
	// 	AllowedOrigins:     []string{"*"},
	// 	AllowedMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
	// 	AllowedHeaders:     []string{"*"},
	// 	ExposedHeaders:    []string{"*"},
	// 	AllowCredentials: true,
	// 	AllowOriginFunc: func(origin string) bool {
	// 		return origin == "*"
	// 	},
	// };
	// corsHandler := cors.New(corsOptions).Handler(r)
	http.ListenAndServe(":8089", nil)
}