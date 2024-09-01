import React, { useEffect, useState, useRef } from "react";
import classes from './style.module.css'
import Message from "./Message";
import Invite from "./Invite";

function Chat(props) {
    const css = [classes.Chat]
    const [messages, setMessages] = useState([])
    const [text, setText] = useState('')
    const chatRef = useRef()
    const [invite, setInvite] = useState(false)
    if(props.active) {
        css.push(classes.active)
    }
    async function call_get() {
        const baseURL = 'http://127.0.0.1:8000/'
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + props.token
            }
        }
        if(props.active) {
            fetch(baseURL + 'chat_get', options)
            .then(response => {
                response.json()
                .then(body => {
                    if(response.status == 200) {
                        const m = []
                        body['messages'].forEach(message => {
                            m.push({id: message['id'], author: message['user_id'], text: message['text']})
                        });
                        setMessages(m)
                    }
                    else {
                        console.log(body)
                    }
                })
            })
        }
    }
    function call_send() {
        const baseURL = 'http://127.0.0.1:8000/'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + props.token
            },
            body: JSON.stringify({
                'text': text
            })
        }
        if(props.active) {
            fetch(baseURL + 'chat_send', options)
            .then(response => {
                response.json()
                .then(body => {
                    if(response.status == 200) {
                        console.log(body)
                        call_get()
                    }
                    else {
                        console.log(body)
                    }
                })
            })
        }
    }
    function logout() {
        const baseURL = 'http://127.0.0.1:8000/'
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + props.token
            }
        }
        if(props.active) {
            fetch(baseURL + 'logout', options)
            .then(response => {
                response.json()
                .then(body => {
                    if(response.status == 200) {
                        props.on(true)
                        props.off(false)
                    }
                    else {
                        console.log(body)
                    }
                })
            })
        }
    }
    useEffect(() => {
        const chatBox = chatRef.current;
        chatBox.scrollTop = chatBox.scrollHeight;
      }, [messages])
    return(
        <div ref={chatRef} className={css.join(' ')}>
            {messages.map((message) => 
                <Message ai={call_get} username={props.username} name={message.author} text={message.text} key={message.id} token={props.token}/>
            )}
            <input type="text" value={text} onChange={e => setText(e.target.value)}/>
            <button className={classes.btn} onClick={e => [e.preventDefault(), call_send(), setText('')]}>ОТПРАВИТЬ</button>
            <button className={classes.btn} onClick={e => [e.preventDefault(), call_get()]}>ПРОВЕРИТЬ СООБЩЕНИЯ</button>
            <button className={classes.btn} onClick={e => [e.preventDefault(), logout(), setMessages([])]}>ВЫЙТИ</button>
            <button className={classes.btn} onClick={e => [e.preventDefault(), setInvite(true)]}>ГРУППЫ</button>
            <Invite call={call_get} username={props.username} token={props.token} active={invite} off={setInvite}></Invite>
        </div>
    )
}

export default Chat