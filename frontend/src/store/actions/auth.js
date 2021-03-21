import * as actionTypes from './actionTypes';
import axios from 'axios';
import api from '../../api';
import { message } from 'antd';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
}

export const authSuccess = (token) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    };
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
}

export const authCreated = () => {
    return {
        type: actionTypes.AUTH_CREATED        
    };
}

export const passwordResetStart = () => {
    return {
        type: actionTypes.RESET_START
    };
}


export const passwordResetSuccess = () => {
    return {
        type: actionTypes.RESET_SUCCESS
    };
}

export const passwordResetFail = error => {
    return {
        type: actionTypes.RESET_FAIL,
        error: error
    };
}

export const passwordResetConfirmStart = () => {
    return {
        type: actionTypes.RESET_CONFIRM_START
    };
}


export const passwordResetConfirmSuccess = () => {
    return {
        type: actionTypes.RESET_CONFIRM_SUCCESS
    };
}

export const passwordResetConfirmFail = error => {
    return {
        type: actionTypes.RESET_CONFIRM_FAIL,
        error: error
    };
}

export const logout = () => {
    localStorage.removeItem('token');    
    message.info("Signed out")
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const authLogin = (email, password) => {
    return dispatch => {
        dispatch(authStart());
        axios.post(api.signin, {
            email: email,
            password: password
        })
        .then(res => {            
            const token = res.data.key;            
            localStorage.setItem('token', token);            
            dispatch(authSuccess(token));                        
        })
        .catch(err => {
            dispatch(authFail(err));            
        })
    }
}

export const authSignup = (username, email, password1, password2) => {
    return dispatch => {        
        dispatch(authStart());
        axios.post(api.signup, {
            username: username,
            email: email,
            password1: password1,
            password2: password2
        })
        .then(res => {
            dispatch(authCreated())           
        })
        .catch(err => {
            dispatch(authFail(err))
        })
    }
}

export const authPasswordReset = (email) => {
    return dispatch => {        
        dispatch(passwordResetStart())
        axios.post(api.passwordreset, {
            email: email            
        })
        .then(res => {                      
            console.log(res.data)            
            dispatch(passwordResetSuccess())                                  
        })
        .catch(err => {            
            console.log(err.message)            
            dispatch(passwordResetFail(err.message))  
        })
    }
}

export const authPasswordResetConfirm = (uid, token, new_password1, new_password2) => {
    return dispatch => {        
        dispatch(passwordResetConfirmStart)                
        axios.post(api.passwordresetconfirm, {
            new_password1: new_password1,
            new_password2: new_password2,
            uid: uid,
            token: token
        })
        .then(res => {                      
            console.log(res.data)            
            dispatch(passwordResetConfirmSuccess())                                  
        })
        .catch(err => {            
            console.log(err.message)            
            dispatch(passwordResetConfirmFail())  
        })
    }
}

export const authFacebook = (access_token) => {
    return dispatch => {
        console.log(access_token)
        // dispatch(authStart());
        axios.post(api.authFacebook, {
            access_token: access_token,            
        })
        .then(res => {            
            console.log(res)                
        })
        .catch(err => {
            console.log(err)                    
        })
    }
}