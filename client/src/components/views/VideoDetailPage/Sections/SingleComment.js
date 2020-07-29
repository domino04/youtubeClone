import React, { useState } from 'react'
import { Comment, Avatar, Button, Input } from 'antd'
import { useSelector } from 'react-redux'
import Axios from 'axios'

const { Textarea } = Input;

function SingleComment(props) {
    const user = useSelector(state => state.user)

    const [CommentValue, setCommentValue] = useState('')
    const [OpenReply, setOpenReply] = useState(false)

    const onHandelChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
        console.log('오픈', OpenReply)
    }

    const onSubmit = (event) => {
        event.preventDefault()

        const variables = {
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
            content: CommentValue,
        }

        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                console.log('싱글안녕', variables)
                if (response.data.success) {
                    setCommentValue('')
                    setOpenReply(!OpenReply)
                    props.refreshFunction(response.data.result)
                } else {
                    alert('커멘트를 저장하지 못했습니다. ')
                }
            })
    }

    const actions = [
        <span onClick={openReply} key="comment-basic-reply-to">Reply to </span>
    ]

    console.log('프롭 코멘트', props.comment)

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt="image" />}
                content={<p>{props.comment.content}</p>}
            ></Comment>


            {OpenReply &&
                <form style={{ display: 'flex' }} onSubmit={onSubmit} >
                    <Textarea
                        style={{ width: '100%', borderRadius: '5px' }}
                        onChange={onHandelChange}
                        value={CommentValue}
                        placeholder="코멘트를 작성해주세요" />
                    <br />
                    <button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>Submit</button>
                </form>
            }

        </div>
    )
}

export default SingleComment