import React, { useState } from "react";
import classes from './style.module.css'

function LogForm(props) {
    const css = [classes.RegForm]
    const [email, emailChange] = useState('')
    const [pass, passChange] = useState('')
    function info(token) {
        const baseURL = 'http://127.0.0.1:8000/'
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }
        fetch(baseURL + 'user_info', options)
        .then(response => {
            response.json()
            .then(body => {
                if(response.status == 200) {
                    props.setName(body['id'])
                }
                else {
                    console.log(response)
                }
            })
        })
    }
    function call() {
        const baseURL = 'http://127.0.0.1:8000/'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                'email': email,
                'password': pass
            })
        }
        fetch(baseURL + 'login', options)
        .then(response => {
            response.json()
            .then(body => {
                if(response.status == 200) {
                    console.log(body)
                    props.setToken(body['token'])
                    info(body['token'])
                    props.chatOn(true)
                    props.off(false)
                }
                else {
                    console.log(response)
                }
            })
        })
    }
    if(props.active) {
        css.push(classes.active)
    }
    return (
        <div className={css.join(' ')}>
            <h3>EMAIL</h3>
            <input type="email" name="email" value={email} onChange={e => emailChange(e.target.value)}/>
            <h3>ПАРОЛЬ</h3>
            <input type="password" name="password" value={pass} onChange={e => passChange(e.target.value)}/>
            <button onClick={e => [e.preventDefault(), call()]} >ВЕРНУТЬСЯ В ИСТОРИЮ</button>
        </div>
    );
}
  
  export default LogForm;