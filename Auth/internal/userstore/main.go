package userstore

import (
	"os"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

// User модель пользователя
type User struct {
	Login    string `json:"login" gorm:"primaryKey"`
	Name     string `json:"name"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type UserStore struct {
	db *gorm.DB
}

func New() *UserStore {
	us := &UserStore{}
	dsn := "host=" + os.Getenv("DB_HOST") + " port=" + os.Getenv("DB_PORT") + " user=" + os.Getenv("DB_USER") + " dbname=" + os.Getenv("DB_NAME") + " password=" + os.Getenv("DB_PASSWORD") + " sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	us.db = db
	db.Debug().AutoMigrate(&User{})
	if err != nil {
		log.Println(err)
	}
	return us
}

func (us *UserStore) CreateUser(user User) string {
	result := us.db.Create(&user)
	if result.Error != nil {
		log.Println(result.Error)
	}
	return user.Login
}

func (us *UserStore) DeleteUserById(id int) string {
	user := User{}
	us.db.Delete(&user, id)
	//result := db.Where("login := ?", id).Delete(&Song)
	return user.Login
}
func (us *UserStore) GetAllUsers() []User {
	var users []User
	result := us.db.Find(&users)
	if result.Error != nil {
		log.Println(result.Error)
	}
	return users
}

func (us *UserStore) GetUsersByName(userName string) []User {
	var users []User
	result := us.db.Where("name = ?", userName).Find(&users)
	if result.Error != nil {
		log.Println(result.Error)
	}
	return users
}

func (us *UserStore) GetUsersByLogin(userName string) []User{
	var users []User
	result := us.db.Where("login = ?", userName).Find(&users)
	if result.Error != nil {
		log.Println(result.Error)
	}
	return users;
}
