import { addComment, fetchComments, selectAllComments } from "../../redux/slices/commentsSlice"
import AddComment from "./AddComment"
import CommentList from "./CommentList"
import { useDispatch, useSelector} from "react-redux"
import { useEffect } from "react"


const CommentPanel = (props) => {
    const dispatch = useDispatch()
    const comments = useSelector(selectAllComments)
    const commentStatus = useSelector(state => state.comments.status)
  
    useEffect(() => {
      if (commentStatus === 'idle') {
        dispatch(fetchComments);
        console.log(comments)
      }
    }, [commentStatus, dispatch])
  
    return(
<div>
              <div className='CommentPanel'>
                  {CommentList({comments})}
              </div>
              <div>
                {AddComment({songId:props.songId})}
              </div>
          </div>
      );
  }
export default CommentPanel;