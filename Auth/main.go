package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

var (
	secretKey = []byte("kekukallw")
)

// Credentials модель данных для аутентификации
type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// CustomClaims кастомные поля для JWT
type CustomClaims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.StandardClaims
}

func hashPassword(password string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	return string(hash)
}

func registerHandler(w http.ResponseWriter, r *http.Request) {

	var newUser User
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	newUser.Password = hashPassword(newUser.Password)
	users = append(users, newUser)

	w.WriteHeader(http.StatusCreated)
}
