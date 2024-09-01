import React, { useState } from "react";
import classes from './style.module.css'

function Message(props) {
    const css = [classes.Message]
    const cssCreateBtn = [classes.CreateBtn]
    let name = 'СТРАННИК ' + props.name
    if(props.name == 222) {
        name = 'СКАЗОЧНИК'
    }
    else {
        cssCreateBtn.push(classes.active)
        if(Number(props.name) == Number(props.username)) {
            name = 'ВЫ (' + props.name + ')'
            css.push(classes.mine)
        }
    }
    console.log(props.name)
    console.log(props.username)
    if(props.mine) {
        //
    }
    else {
        css.push(classes.others)
    }
    function call_ai() {
        const baseURL = 'http://127.0.0.1:8000/'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + props.token
            },
            body: JSON.stringify({
                'text': props.text
            })
        }
        fetch(baseURL + 'ai', options)
        .then(response => {
            response.json()
            .then(body => {
                if(response.status == 200) {
                    console.log(body)
                    props.ai()
                }
                else {
                    console.log(body)
                }
            })
        })
        
    }
    return(
        <div className={css.join(' ')}>
            <h3>{name}</h3>
            <b>{props.text}</b>
            <button className={cssCreateBtn.join(' ')} onClick={e => [e.preventDefault(), call_ai()]}>РАССКАЗАТЬ ИСТОРИЮ</button>
        </div>
    )
}

export default Message;