package songservice

import (
	"musicland.com/songdetails/internal/store/songstore"
	"musicland.com/songdetails/internal/model/song"
)

type SongService struct {
	store *songstore.SongStore
}

func New() *SongService {
	store := songstore.NewSongStore()
	return &SongService{store: store}
}

func (cs *SongService) CreateSong(title string, artistId string, audioId string) int {
	song := song.Song{
		Title:    title,
		ArtistID: artistId,
		AudioID: audioId,
	}
	result := cs.store.CreateSong(song)
	return result
}

func (cs *SongService) DeleteSongById(id int) int {
	result := cs.store.DeleteSongById(id)
	return result
}

func (cs *SongService) GetAllSongs() []song.Song {
	result := cs.store.GetAllSongs()
	return result
}

func (cs *SongService) GetSongsByName(songName string) []song.Song {
	result := cs.store.GetSongsByName(songName)
	return result
}
