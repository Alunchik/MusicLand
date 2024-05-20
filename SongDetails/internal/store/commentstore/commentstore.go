package commentstore

import (
	"gorm.io/gorm"
	"os"
	"musicland.com/songdetails/internal/model/comment"
	"gorm.io/driver/postgres"

)

type CommentStore struct {
	db *gorm.DB
}

func NewCommentStore() *CommentStore {
	cs := &CommentStore{}
	dsn := "host=" + os.Getenv("DB_HOST") + " user=" + os.Getenv("DB_USER") + " dbname=" + os.Getenv("DB_NAME") + " pacsword=" + os.Getenv("DB_PASSWORD") + " cslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	cs.db = db
	db.Debug().AutoMigrate(&comment.Comment{})
	if err != nil {
		panic(err)
	}
	return cs
}

func (cs *CommentStore) CreateComment(comment comment.Comment) int {
	result := cs.db.Create(&comment)
	if result.Error != nil {
		panic(result.Error)
	}
	return comment.Id
}

func (cs *CommentStore) DeleteCommentById(id int) int {
	comment := comment.Comment{}
	cs.db.Delete(&comment, id)
	return comment.Id
}

func (cs *CommentStore) GetAllComments() []comment.Comment {
	var comments []comment.Comment
	result := cs.db.Find(&comments)
	if result.Error != nil {
		panic(result.Error)
	}
	return comments
}

func (cs *CommentStore) GetCommentsBySongId(songId int) []comment.Comment {
	var comments []comment.Comment
	result := cs.db.Where("songID = ?", songId).Find(&comments)
	if result.Error != nil {
		panic(result.Error)
	}
	return comments
}
