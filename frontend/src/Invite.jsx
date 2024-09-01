import React from "react";
import classes from './style.module.css'
import { useState } from "react";

function Invite(props) {
    const css = [classes.Invite]
    const [invites, setInvites] = useState([])
    const [id, idChange] = useState('')
    if(props.active) {
        css.push(classes.active)
    }
    function check() {
        const baseURL = 'http://127.0.0.1:8000/'
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + props.token
            }
        }
        fetch(baseURL + 'check_invites', options)
        .then(response => {
            response.json()
            .then(body => {
                if(response.status == 200) {
                    const invs = []
                    for(let i=0; i<body['invites'].length;i++) {
                        invs.push({
                            key: i,
                            person: body['people'][i],
                            group: body['invites'][i]
                        })
                    }
                    setInvites(invs)
                    console.log(invites)
                }
                else {
                    console.log(response)
                }
            })
        })
    }
    function send() {
        const baseURL = 'http://127.0.0.1:8000/'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + props.token
            },
            body: JSON.stringify({
                'group': props.username,
                'from': props.username,
                'to': id
            })
        }
        fetch(baseURL + 'invite', options)
        .then(response => {
            response.json()
            .then(body => {
                if(response.status == 200) {
                    console.log(body)
                }
                else {
                    console.log(response)
                }
            })
        })
    }
    function join(username) {
        const baseURL = 'http://127.0.0.1:8000/'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + props.token
            },
            body: JSON.stringify({
                'group': username
            })
        }
        fetch(baseURL + 'group_join', options)
        .then(response => {
            response.json()
            .then(body => {
                if(response.status == 200) {
                    console.log(body)
                    props.call()
                }
                else {
                    console.log(response)
                }
            })
        })
    }
    return(
        <div className={css.join(' ')}>
            <button onClick={e=> [e.preventDefault(), props.off(false)]}>ЗАКРЫТЬ</button>
            <input type="text" name="id" value={id} onChange={e => idChange(e.target.value)} placeholder="НОМЕР СТРАННИКА"/>
            <button onClick={e=> [e.preventDefault(), send(), idChange('')]}>ПРИГЛАСИТЬ</button>
            <button onClick={e=> [e.preventDefault(), check()]}>ПРОВЕРИТЬ ПРИГЛАШЕНИЯ</button>
            {invites.map(invite => 
                <h4 key={invite.key}>СТРАННИК {invite.person} ПРИГЛАСИЛ ВАС В ГРУППУ {invite.group} <button onClick={e=> [e.preventDefault(), join(invite.group), props.off(false)]}>ПРИСОЕДИНИТЬСЯ</button></h4>
            )}
        </div>
    )
}

export default Invite