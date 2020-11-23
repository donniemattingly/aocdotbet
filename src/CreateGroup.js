import React from "react";
import {useForm} from "react-hook-form";
import styled from 'styled-components';
import {AocLink} from "./shared-components";
import firebase from "firebase";

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
    const {register, handleSubmit, watch, errors} = useForm();
    const onSubmit = data => firebase.functions().httpsCallable('createGroup')(data)

    console.log(watch("example")); // watch input value by passing the name of it

    return (
        <div>
            <CreateGroupFormContainer onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <p>You need to create a private leaderboard, once you have paste the ID below. (this is the first section of the join code)</p>
                </div>
                <AocInput name="groupId" defaultValue="" ref={register({required: true})}/>
                {errors.groupId && <ErrorMessage>Your group ID is required to update scores and confirm membership </ErrorMessage>}

                <p> As the group owner, we'll use your session token to fetch group results. Enter it below.</p>

                <AocInput name="sessionId" ref={register({required: true})}/>

                {errors.sessionId && <ErrorMessage>Your session token is required to fetch data</ErrorMessage>}
                <br/>
                <AocSubmit value='[Submit]'/>

                <p>If you have no idea what these are, you're likely in the wrong place. <AocLink to={'/'}> [Go Home] </AocLink></p>
            </CreateGroupFormContainer>
        </div>
    )
}