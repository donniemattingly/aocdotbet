import styled from 'styled-components';
import React from "react";
import firebase from "firebase";
import {StyledFirebaseAuth} from "react-firebaseui";

const firebaseConfig = {
    apiKey: "AIzaSyAZ5A2WQtiDD0Me4MWLGcFlCa1CxUydJyQ",
    authDomain: "aocdotbet.firebaseapp.com",
    databaseURL: "https://aocdotbet.firebaseio.com",
    projectId: "aocdotbet",
    storageBucket: "aocdotbet.appspot.com",
    messagingSenderId: "169770916880",
    appId: "1:169770916880:web:d27b1c365cc8d31ed83e95"
};
firebase.initializeApp(firebaseConfig);

const LoginContainer = styled.div`

`

export const Login = ({...props}) => {
    const uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID
        ]
    };

    return (
        <LoginContainer>
            <h1> aoc.bet </h1>
            <p>
                Wager with friends on advent of code!
            </p>

            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
        </LoginContainer>
    )
}