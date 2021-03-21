import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
    token: localStorage.getItem('token'),    
    error: null,
    loading: false,
    created: false,    
    passwordResetStart: false,   
    passwordResetSuccess: null,
    passwordResetError: null,    
    passwordResetConfirmStart: false,   
    passwordResetConfirmSuccess: null,
    passwordResetConfirmError: null
}

const authStart = (state, action) => {
    return updateObject(state, {
        error: null,
        loading: true
    });
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        token: action.token,        
        error: null,
        loading: false,
        created: false
    });
}

const authFail = (state, action) => {
    return updateObject(state, {        
        error: action.error,
        loading: false
    });
}

const authLogout = (state, action) => {
    return updateObject(state, {        
        token: null,
    });
}

const authCreated = (state, action) => {
    return updateObject(state, {
        token: null,
        error: null,
        loading: false,
        created: true
    });
}

const passwordResetStart = (state, action) => {
    return updateObject(state, {  
        passwordResetStart: true,      
        passwordResetSuccess: null,
        passwordResetError: null
    });
}

const passwordResetSuccess = (state, action) => {
    return updateObject(state, { 
        passwordResetStart: false,       
        passwordResetSuccess: true,
        passwordResetError: null
    });
}

const passwordResetFail = (state, action) => {
    return updateObject(state, {        
        passwordResetStart: false, 
        passwordResetSuccess: null,
        passwordResetError: action.error
    });
}

const passwordResetConfirmStart = (state, action) => {
    return updateObject(state, {  
        passwordResetConfirmStart: true,      
        passwordResetConfirmSuccess: null,
        passwordResetConfirmError: null
    });
}

const passwordResetConfirmSuccess = (state, action) => {
    return updateObject(state, {        
        passwordResetConfirmStart: false, 
        passwordResetConfirmSuccess: true,
        passwordResetConfirmError: null
    });
}

const passwordResetConfirmFail = (state, action) => {
    return updateObject(state, {        
        passwordResetConfirmStart: false, 
        passwordResetConfirmSuccess: null,
        passwordResetConfirmError: action.error
    });
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(state, action);
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action);
        case actionTypes.AUTH_FAIL:
            return authFail(state, action);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state, action); 
        case actionTypes.AUTH_CREATED:
            return authCreated(state, action); 
        case actionTypes.RESET_START:
            return passwordResetStart(state, action);
        case actionTypes.RESET_SUCCESS:
            return passwordResetSuccess(state, action);
        case actionTypes.RESET_FAIL:
            return passwordResetFail(state, action);
        case actionTypes.RESET_CONFIRM_START:
            return passwordResetConfirmStart(state, action);
        case actionTypes.RESET_CONFIRM_SUCCESS:
            return passwordResetConfirmSuccess(state, action);
        case actionTypes.RESET_CONFIRM_FAIL:
            return passwordResetConfirmFail(state, action);
        default:
            return state;
    }
}

export default reducer;