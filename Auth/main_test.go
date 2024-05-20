package main
import (
	"testing"
	"github.com/dgrijalva/jwt-go"
)

func TestCreateJWT(t *testing.T) {
	login := "testuser"
	role := "user"
	result, e := createJWT(login, role)
	if(e!=nil){
		t.Errorf("Error creating jwt: %s", e)
	}
	token, err := jwt.ParseWithClaims(result, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
	if err != nil {
		t.Errorf("Errorparsing jwt: %s", e)
		return
	}

	if claims, ok := token.Claims.(*CustomClaims); ok && token.Valid {
		token_role := claims.Role
		token_login := claims.Login
		if(login != token_login || role != token_role) {
			t.Errorf("Expected: %s %s \n Result: %s %s", login, role, token_login, token_role)
		}
	} else {
		t.Errorf("Jwt is not valid: %s", e)
	}
}