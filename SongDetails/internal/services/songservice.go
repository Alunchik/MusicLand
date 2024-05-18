package songservice
import (
	"musicland.com/songdetails/internal/store"
	"musicland.com/songdetails/internal/model"
)

type SongService struct {
	store *songstore.SongStore
}

func New() *SongService {
	store := songstore.NewSongStore()
	return &SongService{store: store}
}

func (ss *SongService) CreateSong(title string, artistId string, audioId string) int {
	song := song.Song{
		Title:    title,
		ArtistID: artistId,
		AudioID: audioId,
	}
	result := ss.store.CreateSong(song)
	return result
}

func (ss *SongService) DeleteSongById(id int) int {
	result := ss.store.DeleteSongById(id)
	return result
}

func (ss *SongService) GetAllSongs() []song.Song {
	result := ss.store.GetAllSongs()
	return result
}

func (ss *SongService) GetSongsByName(songName string) []song.Song {
	result := ss.store.GetSongsByName(songName)
	return result
}
