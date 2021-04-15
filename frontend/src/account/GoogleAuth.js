import React from 'react';
import GoogleLogin from 'react-google-login';

function GoogleAuth (props) {

    function responseGoogle (response) {
        console.log(response)
    }

    return (
        <div className="App">
            <h1>LOGIN WITH GOOGLE</h1>
            <GoogleLogin 
                clientId="<Google Client ID>"
                buttonText="LOGIN WITH GOOGLE"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
            />
        </div>
    )
}

export default GoogleAuth;