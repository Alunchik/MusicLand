import CommentElement from "./CommentElement";


function RenderComments(comments) {
    console.log(comments)
    return (
        <ul class="commentList">
        {
            comments.map( (commentData) => {
                return(
                    <li>
                        {CommentElement(commentData)}
                    </li>
                )
            }
            )
        }
        </ul>
    )    
}

function CommentList(comments) {
    return(
        <div>
           {RenderComments(comments)}
           </div>
    );
}
export default CommentList;