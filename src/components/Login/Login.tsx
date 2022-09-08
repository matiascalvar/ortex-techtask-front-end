import React, { useEffect, useState } from 'react'
import axios from 'axios';
import validation from '../../utils/validation';
import ResetPassword from '../Modal/ResetPassword';
import logo from '../../assets/images/cropped-ortex_favicon.webp'
import styles from './Login.module.css';

const socket: WebSocket = new WebSocket("ws://stream.tradingeconomics.com/?client=guest:guest");
const requestInfo: string = JSON.stringify({ topic: "subscribe", to: "EURUSD:CUR" });
const URL_SERVER: string = "http://localhost:3000";

export default function Login() {
    interface Response {
        price?: string,
        dt?: any
    }
    interface Errors {
        password?: string,
        email?: string
    }

    const [response, setResponse] = useState<Response>({})
    const [open, setOpen] = useState(false)
    const [input, setInput] = useState({ email: "", password: "" })
    const [errors, setErrors] = useState<Errors>({})

    socket.onopen = () => {
        console.log("WebSocket Client Connected");
        socket.send(requestInfo)
    };
    useEffect(() => {

        socket.onmessage = (msg) => {
            const res = JSON.parse(msg.data);
            if (res.price && res.dt) setResponse({ price: res.price, dt: res.dt })
        };
        // return () => {
        //     console.log("Dismounting...")
        //     socket.close();
        // }
    }, [])


    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
        setErrors(
            validation({
                ...input,
                [e.target.name]: e.target.value,
            })
        );
    }
    function submitHandler(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
        axios.post(`${URL_SERVER}/login`, {
            email: input.email,
            password: input.password
        })
            .then(response => console.log(response))
            .catch(error => console.log(error))
    }

    let bgVideo: JSX.Element = <video className={styles.video} muted={true} playsInline={true} autoPlay={true} loop={true}>
        <source src="https://public.ortex.com/wp-content/uploads/2020/09/iStock-1002667230-1.mp4" type="video/mp4"></source>
    </video>

    return (
        <div className={styles.mainContainer}>
            <ResetPassword open={open} onClose={() => setOpen(false)} />
            {bgVideo}
            <div className={styles.card}>
                <div>
                    <img src={logo} alt="ortex_logo" width="50px" />
                    <h2>Sign In</h2>
                </div>
                {/* FORM */}
                <form autoComplete="off">
                    <div className={styles.inputContainer}>
                        <input
                            className={styles.input}
                            onChange={handleInputChange}
                            value={input.email}
                            name="email"
                            autoComplete="off"
                            type="text"
                            placeholder='Email'
                        />
                        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    </div>
                    <div className={styles.inputContainer}>
                        <input
                            className={styles.input}
                            onChange={handleInputChange}
                            value={input.password}
                            name="password"
                            autoComplete="new-password"
                            type="password"
                            placeholder='Password'
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </div>

                    {/* SIGN IN BTN */}
                    <button
                        className={Object.keys(errors).length === 0 ? styles.btn : styles.btnDisabled}
                        type="submit"
                        onClick={submitHandler}
                        disabled={Object.keys(errors).length === 0 ? undefined : true}
                    >
                        Sign In
                    </button>

                </form>

                {/* Forgot Password */}
                <div className={styles.options}>
                    <p onClick={() => setOpen(true)}>Forgot Password?</p>
                </div>
                {/* WEBSOCKET */}
                {Object.keys(response).length !== 0 ?
                    <div className={styles.websocket}>
                        <p>1 EUR =  {response ? response.price : null} USD</p>
                        <p>{response ? (new Date(response.dt).toLocaleString()) === "Invalid Date" ? null : new Date(response.dt).toLocaleString() : null}</p>
                    </div>
                    : <div className={styles.loading}></div>}
            </div>
        </div>
    )
}
