import React, { useState } from 'react';
import Axios from 'axios';

import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {

    // 아래는 url에서  비디오 아이디 받아오는것.
    // const videoId = props.match.params.videoId
    const videoId = props.postId
    const user = useSelector(state => state.user)
    const [Comment, setComment] = useState('')

    const handleClick = (event) => {

        setComment(event.currentTarget.value)
    }
    const onSubmit = (event) => {
        event.preventDefault()

        const variables = {
            content: Comment,
            writer: user.userData._id,
            postId: videoId
        }

        console.log('배리어블', variables)

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                console.log('안녕', variables)
                if (response.data.success) {
                    console.log(response.data.result)
                    setComment('')
                    props.refreshFunction(response.data.result)
                } else {
                    alert('커멘트를 저장하지 못했습니다. ')
                }
            })
    }


    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />

            {/* Comment Lists */}
            {console.log("프롭", props.CommentLists)}
            {props.CommentLists && props.CommentLists.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment>
                        <SingleComment
                            comment={comment}
                            refreshFunction={props.refreshFunction}
                            postId={videoId} />
                        <ReplyComment
                            CommentLists={props.CommentLists}
                            refreshFunction={props.refreshFunction}
                            postId={videoId}
                            parentCommentId={comment._id} />
                    </React.Fragment>
                )
            ))}


            {/* Root Comment Form */}
            <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value={Comment}
                    placeholder="코멘트를 작성해주세요" />
                <br />
                <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default Comment