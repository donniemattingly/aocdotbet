import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import styled from 'styled-components';
import {AocAnchor, AocLink, AocRadio, Smaller} from "../shared-components";
import firebase from "firebase";
import {UnicodeSpinner} from "../UnicodeSpinner";
import {useStoreActions, useStoreState} from "easy-peasy";
import {useParams} from "react-router-dom"

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

export const JoinGroup = ({...props}) => {
    const [submitting, setSubmiting] = useState();
    const {register, handleSubmit, errors} = useForm();
    const [createGroupError, setCreateGroupError] = useState(null);
    const [createGroupSuccess, setCreateGroupSuccess] = useState(null);
    const [allowDerivatives, setAllowDerivatives] = useState(true);
    const urlJoinCode = useParams()['joinCode'];
    const savedJoinCode = useStoreState(state => state.joinCode);
    const setJoinCode = useStoreActions(actions => actions.setJoinCode);
    const loggedIn = useStoreState(state => state.loggedIn);
    const userId = useStoreState(state => state.auth.id);
    const joinCode = urlJoinCode || savedJoinCode || "";

    useEffect(() =>{
        if(urlJoinCode){
            setJoinCode(urlJoinCode);
        }
    }, [urlJoinCode])

    const onSubmit = async data => {
        setSubmiting(true);
        setCreateGroupError(null);
        setCreateGroupSuccess(null);
        try {
            const leaderboard = await firebase.functions().httpsCallable('joinGroup')(
                {uid: userId, allowDerivatives, ...data}
                )
            setCreateGroupSuccess(true);
        } catch (error) {
            setCreateGroupError(error.message);
        }
        setSubmiting(false);
    }

    if (!loggedIn) {
        return <div>
            <p> You must <AocLink to={'/login'}>[log in]</AocLink> to join a group</p>
        </div>
    } else {

        return (
            <div>
                <CreateGroupFormContainer onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <p>
                            To join a group, you need to be a member of the private leaderboard for this group
                            on <AocAnchor href="https://adventofcode.com/2020/leaderboard/private">Advent of
                            Code</AocAnchor>
                        </p>

                        <p>
                            You can join the group by entering your leaderboard's join code here:
                        </p>
                    </div>
                    <span>
                        <AocInput name="joinCode" defaultValue={joinCode} ref={register({required: true})}/>
                        {' '}
                        {(!submitting && !createGroupSuccess) && <AocSubmit value='[Submit]'/>}
                        {submitting && <UnicodeSpinner spinner='boxBounce2'/>}
                    </span>
                    {errors.joinCode &&
                    <ErrorMessage>You must enter the join code </ErrorMessage>}
                    <br/>
                    {createGroupError && <ErrorMessage>{createGroupError}</ErrorMessage>}
                    {createGroupSuccess &&
                    <span>You joined the group! <AocLink to={'/groups'}>[View your groups]</AocLink></span>}
                    <Smaller>
                        <AocRadio
                        onClick={() => setAllowDerivatives(!allowDerivatives)}
                        value={allowDerivatives}
                        label='Allow others to make wagers about my results'/>
                    </Smaller>
                </CreateGroupFormContainer>
            </div>
        )
    }
}
