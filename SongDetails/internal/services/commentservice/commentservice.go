package commentservice

import (
	"musicland.com/songdetails/internal/store/commentstore"
	"musicland.com/songdetails/internal/model/comment"
)

type CommentService struct {
	store *commentstore.CommentStore
}

func New() *CommentService {
	store := commentstore.NewCommentStore()
	return &CommentService{store: store}
}

func (ss *CommentService) CreateComment(text string, authorId string, songId string) int {
	comment := comment.Comment{
		Text:    text,
		AuthorID: authorId,
		SongID: songId,
	}
	result := ss.store.CreateComment(comment)
	return result
}

func (ss *CommentService) DeleteCommentById(id int) int {
	result := ss.store.DeleteCommentById(id)
	return result
}

func (ss *CommentService) GetAllComments() []comment.Comment {
	result := ss.store.GetAllComments()
	return result
}

func (ss *CommentService) GetCommentsBySongId(songId int) []comment.Comment {
	result := ss.store.GetCommentsBySongId(songId)
	return result
}
