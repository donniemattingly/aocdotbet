import styled from 'styled-components';
import React from "react";
import firebase from "firebase";
import {StyledFirebaseAuth} from "react-firebaseui";
import {useStoreActions, useStoreState} from "easy-peasy";
import {AocButton} from "./shared-components";

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
        signInFlow: 'redirect',
        signInSuccessUrl: '/',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.GithubAuthProvider.PROVIDER_ID
        ]
    };

    const auth = useStoreState(state => state.auth);
    const signOut = useStoreActions(actions => actions.signOut)

    if(!auth?.loggedIn) {
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
    } else {
        return (
            <LoginContainer>
                <AocButton onClick={signOut}> [Log Out] </AocButton>
            </LoginContainer>
        )
    }
}