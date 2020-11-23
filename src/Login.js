import styled from 'styled-components';
import React from "react";
import firebase from "firebase";
import {StyledFirebaseAuth} from "react-firebaseui";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const FirebaseAuthContainer = styled.div`
  display: flex;
  justify-content: start;
`

export const Login = ({...props}) => {
    const uiConfig = {
        signInFlow: 'popup',
        signInSuccessUrl: '/',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID
        ]
    };

    return (
        <LoginContainer>
            <p>
                Sign in with the same auth provider you use for <a>adventofcode.com</a>
            </p>
            <FirebaseAuthContainer>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
            </FirebaseAuthContainer>
        </LoginContainer>
    )
}