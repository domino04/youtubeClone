import React, { useEffect, useState } from "react";
import Axios from 'axios';

function Subscribe(props) {


    const [SubscribeNumber, setSubscribeNumber] = useState(0)
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        let variable = { userTo: props.userTo }
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if (response.data.success) {
                    console.log('넘버', response.data)
                    setSubscribeNumber(response.data.SubscribeNumber)
                } else {
                    alert('구독자 수 정보를 받아오지 못했습니다.')
                }
            })

        let subscribedvariable = { userTo: props.userTo, userFrom: localStorage.getItem('userId') }
        Axios.post('/api/subscribe/subscribed', subscribedvariable)
            .then(response => {
                if (response.data.success) {
                    console.log('하이', response.data)
                    setSubscribed(response.data.Subscribed)
                } else {
                    alert('정보를 받아오지 못했습니다.')
                }
            })

    }, [])

    const onsubscribe = () => {

        let subscribedVariable = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }
        console.log('구독상태', Subscribed)
        if (Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', subscribedVariable)
                .then(response => {
                    if (response.data.success) {
                        console.log('sdfdfd', response.data)
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 취소 하는데 실패했습니다.')
                    }
                })

        } else {
            Axios.post('/api/subscribe/Subscribe', subscribedVariable)
                .then(response => {
                    if (response.data.success) {
                        setSubscribeNumber(SubscribeNumber + 1)
                        setSubscribed(!Subscribed)
                    } else {
                        alert('구독 하는데 실패했습니다.')
                    }
                })
        }
    }
    return (
        <div>
            <button style={{
                backgroundColor: `${Subscribed ? "#AAAAAA" : "#CC0000"}`, borderRadius: '4px',
                color: 'white', padding: '10px 16px', foreWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}
                onClick={onsubscribe}
            >
                {SubscribeNumber} {Subscribed ? "Subscribed" : "Subscribe"}
            </button>
        </div>
    )
}

export default Subscribe