package song

import (
	"gorm.io/gorm"
)

type Song struct {
	gorm.Model
	Id int `json:"id"` 
	Title string `json:"title"`
	ArtistID string `json: "artistID"`
	AudioID string `json: "audioID"`
}