package config
import (
	"fmt"
	//"strconv"
	"encoding/json"
	"github.com/dgrijalva/jwt-go"
	"net/http"
)
var (
	secretKey = []byte("kekukallw")
)
type CustomClaims struct {
	Login string `json:"login`
	Role  string `json:"role"`
	jwt.StandardClaims
}

func RenderJSON(w http.ResponseWriter, v interface{}) {
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
	
	func AdminMiddleware(next http.HandlerFunc) http.HandlerFunc {
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
	
			if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid && claims.Role=="admin"{
				fmt.Println("Authenticated user:", claims.Login)
					next.ServeHTTP(w, r)
			} else {
				http.Error(w, "Invalid token", http.StatusUnauthorized)
			}
		}
	}
	

	func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodOptions {
				// Если это предварительный запрос OPTIONS - просто возвращаем разрешающие заголовки
				w.WriteHeader(http.StatusOK)
				return
			}
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

