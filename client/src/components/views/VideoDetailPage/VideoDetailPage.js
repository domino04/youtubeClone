import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from 'antd';
import Axios from "axios";
import SideVideo from './Sections/SideVideo';  //하위 컴포넌트
import Subscribe from './Sections/Subscribe';  //하위 컴포넌트
import Comment from './Sections/Comment';  //하위 컴포넌트

function VideoDetailPage(props) {
    // URL에서 videoId 가져오기
    const videoId = props.match.params.videoId

    // 비디오, 코멘트 state 정의
    const [VideoDetail, setVideoDetail] = useState([])
    const [CommentLists, setCommentLists] = useState([])

    const variable = { videoId: videoId }

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable).then(response => {
            // 비디오아이디를 back으로 varirable로 보내서
            if (response.data.success) {   // response가 있다면
                // back(routes/video.js)에서 보내주는 videoDetail로 VideoDetail의 state를 업뎃시켜준다.
                // 페이지에 해당하는 비디오의 정보를 가져와서 state에 박아준 것.
                setVideoDetail(response.data.videoDetail)
            } else {  //response가 없다면
                alert('비디오 정보를 가져오는데에 실패했습니다.')
            }
        })


        Axios.post('/api/comment/getComments', variable)
            .then(response => {
                // 비디오아이디를 back으로 보내서
                if (response.data.success) { //response가 있다면
                    // back에서 보내주는 result로 CommentLists의 state 업뎃시켜준다.
                    // 비디오에 해당하는 코멘트 정보를 가져와서 state에 박아준 것.
                    setCommentLists(response.data.result)
                } else { //response가 없다면
                    alert('코멘트 정보를 가져오는 것을 실패하였습니다.')
                }
            })
    }, [])

    // 새로운 댓글이 달릴 때마다 CommentLists의 state를 업데이트 시켜주는 함수
    // 언제 실행되면 좋을까?
    // 코멘트 submit 버튼을 누를 때 마다!
    const refreshFunction = (newComment) => {
        // CommentLists 배열에 newComment를 concat이라는 내장함수로 추가시켜줌.
        setCommentLists(CommentLists.concat(newComment))
    }

    // 비디오의 작성자가 있을 때만 보여줌
    if (VideoDetail.writer) {
        // 구독버튼은 비디오 작성자의 _id와 접속자의 userId가 다를 때만 보여짐.
        // 구독버튼은 userTo(구독당하는 사람=비디오 작성자)와 userFrom(구독하는 사람=접속자) 값을 가짐 
        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
        return (
            //그리드 
            <Row gutter={[16, 16]} >
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }}
                            /* 비디오를 가져올 때 위치는? 서버 -> 몽고db -> 서버 받아온 filepath이용. */
                            src={`http://localhost:5000/${VideoDetail.filepath}`}
                            controls />
                        <List.Item actions={[subscribeButton]}> {/* 구독버튼 */}
                            <List.Item.Meta
                                // 비디오에서 정보 가져와서 작성자 프로필사진, 비디오제목, 비디오설명 등을 보여줌.
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}>

                            </List.Item.Meta>

                            {/* comment */}
                        </List.Item>

                        {/* Comment라는 하위 컴포넌트 받아온다. 아래는 프롭으로 보내줄 elements들 */}
                        <Comment refreshFunction={refreshFunction} CommentLists={CommentLists} postId={videoId} />

                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    } else {
        return (<div>...loading</div>)
    }
}

export default VideoDetailPage