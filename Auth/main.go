package main

import (
	"encoding/json"
	"log"
	"github.com/joho/godotenv"
	"fmt"
	"github.com/gorilla/mux"
	"time"
	"github.com/rs/cors"
	"net/http"
	"musicland.com/auth/internal/userstore"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

var (
	secretKey = []byte("kekukallw")
)
type UserServer struct {
	store *userstore.UserStore
}

func NewUserServer() *UserServer {
	store := userstore.New()
	return &UserServer{store: store}
}
// Credentials модель данных для аутентификации
type Credentials struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}

// CustomClaims кастомные поля для JWT
type CustomClaims struct {
	Login string `json:"login`
	Role  string `json:"role"`
	jwt.StandardClaims
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


func hashPassword(password string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	return string(hash)
}

func (userserver *UserServer) registerHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
        // Если это предварительный запрос OPTIONS - просто возвращаем разрешающие заголовки
        w.WriteHeader(http.StatusOK)
        return
       }
	var newUser userstore.User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	newUser.Password = hashPassword(newUser.Password)
	newUser.Role="user"
	userserver.store.CreateUser(newUser)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusCreated)
}
func (userserver *UserServer) getUserByLoginHandler(w http.ResponseWriter, req *http.Request) {
	if req.Method == http.MethodOptions {
        // Если это предварительный запрос OPTIONS - просто возвращаем разрешающие заголовки
        w.WriteHeader(http.StatusOK)
        return
       }
	login := req.URL.Query().Get("login")
	log.Printf("handling get user at %s with login %s\n", req.URL.Path, login)
	users := userserver.store.GetUsersByLogin(login);
	user := userstore.User{}
	if(len(users)>0){
		user = users[0]
	}
	renderJSON(w, 200, user);
}


func createJWT(login string, role string) string, error{
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := CustomClaims{
		Login: login,
		Role:  role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func (userserver *UserServer) loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
        w.WriteHeader(http.StatusOK)
        return
    }
	var creds Credentials
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		returnhttp.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	tokenString, err != Login(creds);
	if(err!=nil) {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}

func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			return secretKey, nil
		})
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
			fmt.Println("Authenticated user:", claims.Login)
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
		}
	}
}

func Login(creds Credentials) string, error{
	var user userstore.User
	for _, u := range userserver.store.GetUsersByLogin(creds.Login) {
		if  bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(creds.Password)) == nil {
			user = u
			break
		}
	}

	if user.Id == 0 {
		return errors.New("Invalid credentials")
	}
	// Создаем JWT
	tokenString := createJWT(user.Login, user.Role)
	return tokenString
}

func main() {

	err := godotenv.Load()
	if err != nil {
	  log.Fatal("Error loading .env file")
	}
	userserver := NewUserServer();
	r := mux.NewRouter()
	r.HandleFunc("/register", userserver.registerHandler)
	r.HandleFunc("/login", userserver.loginHandler)
	r.HandleFunc("/getUserByLogin", userserver.getUserByLoginHandler)
	r.HandleFunc("/protected", authMiddleware(protectedHandler))
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "DELETE", "POST", "PUT"},
	})
	handler := c.Handler(r)
	fmt.Println("Server started at :8087")
	http.ListenAndServe(":8087", handler)
}          

func protectedHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Protected content"))
}