import React from "react";
import classes from './style.module.css'
import RegForm from "./RegForm";
import LogForm from "./LogForm";
import { useState } from "react";
import Chat from './Chat'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import "swiper/css/autoplay";
import 'swiper/css/effect-fade'

function App() {
	const [regAct, regSee] = useState(true)
	const [logAct, logSee] = useState(false)
	const [chat, chatSee] = useState(false)
	const [token, setToken] = useState('')
	const [username, setUsername] = useState('')
	const cssBtns = [classes.btns] //8DDFB4716CB6BA2155279749360EF7B0
	if(!chat) {                    //923AC6C2B426F0CA270AC43228625010
		cssBtns.push(classes.active)
	}
	return (
		<div className={classes.App}>
			<p></p><h1>TALES UNIVERSE</h1>
			<h4>Команда Overdrive</h4>
			<div className={cssBtns.join(' ')}>
				<button onClick={e => [e.preventDefault(), regSee(true), logSee(false)]}>РЕГИСТРАЦИЯ</button>
				<button onClick={e => [e.preventDefault(), regSee(false), logSee(true)]}>АВТОРИЗАЦИЯ</button>
			</div>
			<RegForm name={username} setName={setUsername} active={regAct} token={token} setToken={setToken} off={regSee} chatOn={chatSee}/>
			<LogForm name={username} setName={setUsername} active={logAct} token={token} setToken={setToken} off={logSee} chatOn={chatSee}/>
			<Chat off={chatSee} on={logSee} username={username} active={chat} token={token} />
			<Swiper
				effect={'fade'}
				autoplay={{
					delay: 4000,
					disableOnInteraction: false,
				}}
				spaceBetween={5}
				slidesPerView={1}
				modules={[Autoplay, EffectFade]}
				loop
				className={classes.swiper}
				>
				<SwiperSlide><img className={classes.Img} src="1x.png" alt="" /></SwiperSlide>
				<SwiperSlide><img className={classes.Img} src="2x.png" alt="" /></SwiperSlide>
				<SwiperSlide><img className={classes.Img} src="3x.png" alt="" /></SwiperSlide>
				<SwiperSlide><img className={classes.Img} src="4x.png" alt="" /></SwiperSlide>
				<SwiperSlide><img className={classes.Img} src="5x.png" alt="" /></SwiperSlide>
			</Swiper>
		</div>
	);
}

export default App;
