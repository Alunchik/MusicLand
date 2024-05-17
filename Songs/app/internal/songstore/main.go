package songstore

import (
	"os"

	"gorm.io/gorm"

	"gorm.io/driver/postgres"

)

type Song struct {
	gorm.Model
	id int `json:"id"` 
	Title string `json:"title"`
	ArtistID int `json: "artistID"`
	AudioID string `json: "audioID"`
}

type SongStore struct {
	//sync.Mutex
	db *gorm.DB
	//songs map[int]Song
	//nextId int
}

func New() *SongStore {
	ss := &SongStore{}
	dsn := "host=" + os.Getenv("DB_HOST") + " user=" + os.Getenv("DB_USER") + " dbname=" + os.Getenv("DB_NAME") + " password=" + os.Getenv("DB_PASSWORD") + " sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	ss.db = db
	db.Debug().AutoMigrate(&Song{})
	if err != nil {
		panic(err)
	}
	//ss.songs = make(map[int]Song)
	//ss.nextId = 0
	return ss
}

func (ss *SongStore) CreateSong(title string, artistId int) int {
	//ss.Lock()
	//defer ss.Unlock()

	song := Song{
		Title:    title,
		ArtistID: artistId}
	result := ss.db.Create(&song)
	if result.Error != nil {
		panic(result.Error)
	}
	//ss.songs[ss.nextId] = song
	//ss.nextId++
	return song.id
}

func (ss *SongStore) DeleteSongById(id int) int {
	song := Song{}
	ss.db.Delete(&song, id)
	//result := db.Where("ID := ?", id).Delete(&Song)
	return song.id
}

func (ss *SongStore) GetAllSongs() []Song {
	//ss.Lock()
	//defer ss.Unlock()

	//allSongs := make([]Song, 0, len(ss.songs))
	// for _, song := range ss.songs {
	// 	allSongs = append(allSongs, song)
	// }

	var songs []Song
	result := ss.db.Find(&songs)
	if result.Error != nil {
		panic(result.Error)
	}
	return songs
}

func (ss *SongStore) GetSongsByName(songName string) []Song {
	//ss.Lock()
	//defer ss.Unlock()

	var songs []Song
	result := ss.db.Where("title = ?", songName).Find(&songs)
	if result.Error != nil {
		panic(result.Error)
	}
	return songs
}

// func (ss *SongStore) GetSongsByArtist(artistName string) []Song {
// 	ss.Lock()
// 	defer ss.Unlock()

// 	allSongs := make([]Song, 0, len(ss.songs))
// 	for _, song := range ss.songs {
// 		allSongs = append(allSongs, song)
// 	}
// 	return allSongs
// }
