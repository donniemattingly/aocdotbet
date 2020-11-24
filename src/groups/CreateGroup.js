import React, {useState} from "react";
import {useForm} from "react-hook-form";
import styled from 'styled-components';
import {AocLink} from "../shared-components";
import firebase from "firebase";
import {UnicodeSpinner} from "../UnicodeSpinner";
import {useStoreState} from "easy-peasy";

const CreateGroupFormContainer = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: start;
`

const AocSubmit = styled.input.attrs({type: 'submit'})`
    background: transparent;
    border: 0;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
    padding: 0;
    color: #009900;
    cursor: pointer;
    width: 20em;
    justify-content: start;
    text-align: start;
`

export const AocInput = styled.input`
    background: transparent;
    color: inherit;
    border: 1px solid #666666;
    background: #10101a;
    padding: 0 2px;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
    width: 20em;
`

const ErrorMessage = styled.span`
  color: #800000;
`

export const CreateGroup = ({...props}) => {
    const [submitting, setSubmiting] = useState();
    const {register, handleSubmit, errors} = useForm();
    const [createGroupError, setCreateGroupError] = useState(null);
    const [createGroupSuccess, setCreateGroupSuccess] = useState(null);
    const loggedIn = useStoreState(state => state.loggedIn);
    const userId = useStoreState(state => state.auth.id);

    const onSubmit = async data => {
        setSubmiting(true);
        setCreateGroupError(null);
        setCreateGroupSuccess(null);
        try {
            const leaderboard = await firebase.functions().httpsCallable('createGroup')({uid: userId, ...data})
            setCreateGroupSuccess(true);
        } catch (error) {
            setCreateGroupError(error.message);
        }
        setSubmiting(false);
    }

    if (!loggedIn) {
        return <div>
            <p> You must log in to create a group</p>
        </div>
    } else {

        return (
            <div>
                <CreateGroupFormContainer onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <p>
                            You must first create a private leaderboard.
                            Once created, enter the join code for the leaderboard below.
                        </p>
                    </div>
                    <AocInput name="joinCode" defaultValue="" ref={register({required: true})}/>
                    {errors.joinCode &&
                    <ErrorMessage>Your group ID is required to update scores and confirm membership </ErrorMessage>}

                    <p>
                        As the group owner, we'll use your session token to fetch group results. Enter it below.
                    </p>

                    <AocInput name="session" ref={register({required: true})}/>

                    {errors.sessionId && <ErrorMessage>Your session token is required to fetch data</ErrorMessage>}
                    <br/>
                    {!submitting && <AocSubmit value='[Submit]'/>}
                    {submitting && <UnicodeSpinner spinner='boxBounce2'/>}
                    {createGroupError && <ErrorMessage>{createGroupError}</ErrorMessage>}
                    {createGroupSuccess && <span>Your Group was created!</span>}

                    <p>
                        If you have no idea what these are, you're likely in the wrong place.
                        <AocLink to={'/'}>
                            [Go Home]
                        </AocLink>
                    </p>
                </CreateGroupFormContainer>
            </div>
        )
    }
}
