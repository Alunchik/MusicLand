package comment

import (
	"gorm.io/gorm"
	"time"
)

type Comment struct {
	gorm.Model
	Id int `json:"id"` 
	Text string `json:"text"`
	AuthorID string `json: "authorID"`
	SongID string `json: "songID"`
	Created time.Time `json: "created" sql:"DEFAULT:CURRENT_TIMESTAMP"`
}