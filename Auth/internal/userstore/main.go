package userstore

import (
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// User модель пользователя
type User struct {
	id       int    `json:"id"`
	login    string `json:"login"`
	name     string `json:"name"`
	password string `json:"password"`
	role     string `json:"role"`
}

type UserStore struct {
	db *gorm.DB
}

func New() *UserStore {
	us := &UserStore{}
	dsn := "host=" + os.Getenv("DB_HOST") + " user=" + os.Getenv("DB_USER") + " dbname=" + os.Getenv("DB_NAME") + " password=" + os.Getenv("DB_PASSWORD") + " sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	us.db = db
	db.Debug().AutoMigrate(&User{})
	if err != nil {
		panic(err)
	}
	return us
}

func (ss *UserStore) CreateUser(user User) int {
	result := ss.db.Create(&user)
	if result.Error != nil {
		panic(result.Error)
	}
	return user.id
}

func (ss *UserStore) DeleteUserById(id int) int {
	user := User{}
	ss.db.Delete(&user, id)
	//result := db.Where("ID := ?", id).Delete(&Song)
	return user.id
}

func (ss *UserStore) GetAllUsers() []User {
	//ss.Lock()
	//defer ss.Unlock()

	//allSongs := make([]Song, 0, len(ss.songs))
	// for _, song := range ss.songs {
	// 	allSongs = append(allSongs, song)
	// }

	var users []User
	result := ss.db.Find(&users)
	if result.Error != nil {
		panic(result.Error)
	}
	return users
}

func (ss *UserStore) GetUserssByName(userName string) []User {
	//ss.Lock()
	//defer ss.Unlock()

	var users []User
	result := ss.db.Where("name = ?", userName).Find(&users)
	if result.Error != nil {
		panic(result.Error)
	}
	return users
}

func (ss *UserStore) GetUserssByLogin(userName string) []User {
	//ss.Lock()
	//defer ss.Unlock()

	var users []User
	result := ss.db.Where("login = ?", userName).Find(&users)
	if result.Error != nil {
		panic(result.Error)
	}
	return users
}
