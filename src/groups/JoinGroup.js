import React, {useState} from "react";
import {useForm} from "react-hook-form";
import styled from 'styled-components';
import {AocAnchor, AocLink} from "../shared-components";
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

export const JoinGroup = ({...props}) => {
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
            <p> You must log in to join a group</p>
        </div>
    } else {

        return (
            <div>
                <CreateGroupFormContainer onSubmit={handleSubmit(onSubmit)}>

                    <div>
                        <p>
                            To join a group, you need to be a member of the private leaderboard for this group
                            on <AocAnchor href="https://adventofcode.com/2020/leaderboard/private">Advent of Code</AocAnchor>
                        </p>

                        <p>
                            You can join the group by entering your leaderboard's join code here:
                        </p>
                    </div>
                    <span>
                        <AocInput name="joinCode" defaultValue="" ref={register({required: true})}/>
                        {!submitting && <AocSubmit value='[Submit]'/>}
                    </span>
                    {errors.joinCode &&
                    <ErrorMessage>You must enter the join code </ErrorMessage>}
                    <br/>
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
