import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { addComment } from "../../redux/slices/commentsSlice";
const CommentElement = (props) => {
    return (
        <div class="commentElement">
            <div className="commentLine">
            <div className="commentAuthor">
            {
                (props.authorId ? props.authorId  : "unnamed")
            }
            </div>
            <div className="author">
            {
                (props.text)
            }
            </div>
            </div>
            </div>
    )    
}

export default CommentElement
