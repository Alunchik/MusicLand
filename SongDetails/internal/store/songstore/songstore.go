package songstore

import (
	"gorm.io/gorm"
	"os"
	"musicland.com/songdetails/internal/model/song"
	"log"
	"gorm.io/driver/postgres"

)

type SongStore struct {
	db *gorm.DB
}

func NewSongStore() *SongStore {
	ss := &SongStore{}
	dsn := "host=" + os.Getenv("DB_HOST") + " port=" + os.Getenv("DB_PORT")  + " user=" + os.Getenv("DB_USER") + " dbname=" + os.Getenv("DB_NAME") + " password=" + os.Getenv("DB_PASSWORD") + " sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	ss.db = db
	db.Debug().AutoMigrate(&song.Song{})
	if err != nil {
		log.Println(err)
	}
	return ss
}

func (ss *SongStore) CreateSong(song song.Song) int {
	result := ss.db.Create(&song)
	if result.Error != nil {
		log.Println(result.Error)
	}
	return song.Id
}

func (ss *SongStore) DeleteSongById(id int) int {
	song := song.Song{}
	ss.db.Delete(&song, id)
	//result := db.Where("ID := ?", id).Delete(&Song)
	return song.Id
}

func (ss *SongStore) GetAllSongs() []song.Song {
	var songs []song.Song
	result := ss.db.Find(&songs)
	if result.Error != nil {
		log.Println(result.Error)
	}
	return songs
}

func (ss *SongStore) GetSongsByName(songName string) []song.Song {
	var songs []song.Song
	result := ss.db.Where("title = ?", songName).Find(&songs)
	if result.Error != nil {
		log.Println(result.Error)
	}
	return songs
}
