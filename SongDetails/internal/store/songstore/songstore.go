package songstore

import (
	"gorm.io/gorm"
	"os"
	"musicland.com/songdetails/internal/model/song"

	"gorm.io/driver/postgres"

)

type SongStore struct {
	db *gorm.DB
}

func NewSongStore() *SongStore {
	ss := &SongStore{}
	dsn := "host=" + os.Getenv("DB_HOST") + " user=" + os.Getenv("DB_USER") + " dbname=" + os.Getenv("DB_NAME") + " password=" + os.Getenv("DB_PASSWORD") + " sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	ss.db = db
	db.Debug().AutoMigrate(&song.Song{})
	if err != nil {
		panic(err)
	}
	return ss
}

func (ss *SongStore) CreateSong(song song.Song) int {
	result := ss.db.Create(&song)
	if result.Error != nil {
		panic(result.Error)
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
		panic(result.Error)
	}
	return songs
}

func (ss *SongStore) GetSongsByName(songName string) []song.Song {
	var songs []song.Song
	result := ss.db.Where("title = ?", songName).Find(&songs)
	if result.Error != nil {
		panic(result.Error)
	}
	return songs
}
