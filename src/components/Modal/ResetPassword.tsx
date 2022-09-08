import React from 'react'
import  ReactDOM  from 'react-dom'
import styles from './ResetPassword.module.css'

interface ResetPasswordI {
  open: boolean,
  onClose: () => void
}

export default function ResetPassword({open, onClose}: ResetPasswordI) {
  if(!open) return null

    return ReactDOM.createPortal(
        <div className={styles.mainContainer}>
            <div className={styles.card}>
                <button className={styles.btnClose} onClick={onClose}>X</button>
                <h2>Reset your password</h2>
                <p>Please enter your email. We will send you a link.</p>
                <input type="text" placeholder='Email' />
                <button className={styles.btn}>Reset Password</button>

            </div>
        </div>
    , document.getElementById('portal')!
    )
}
