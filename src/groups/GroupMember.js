import {UnicodeSpinner} from "../UnicodeSpinner";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import firebase from "firebase";
import {AocAnchor, AocLink, AocRadio, Smaller} from "../shared-components";
import {AocInput, AocSubmit, ErrorMessage} from "./JoinGroup";
import {useForm} from "react-hook-form";
import styled from 'styled-components';
import {useStoreActions, useStoreState} from "easy-peasy";

const WagerInput = styled(AocInput)`
  width: 4em;
`

export const GroupMember = ({...props}) => {
    const [loading, setLoading] = useState(false);
    const [group, setGroup] = useState(null);
    const {memberId, groupId} = useParams();
    const auth = useStoreState(state => state.auth)

    const [submitting, setSubmitting] = useState();
    const {register, handleSubmit, errors} = useForm();

    const [errorMessage, setErrorMessage] = useState(null);
    const [success, setSuccess] = useState(false);

    const loadUser = useStoreActions(actions => actions.loadUser);

    const onSubmit = async data => {
        setSubmitting(true);
        try {
            const wager = {
                opponent: group?.leaderboard?.members[memberId]?.uid,
                uid: auth.id,
                groupId: groupId,
                details: {
                    type: 'simpleStars',
                    bet: data.bet,
                    toWin: data.toWin
                }
            }
            await firebase.functions().httpsCallable('createWager')(wager)
            setSuccess(true);
            await loadUser(auth.id);
        } catch (error) {
            setErrorMessage(error.message);
        }
        setSubmitting(false);
    }

    useEffect(() => {
        (async () => {
            const doc = await firebase.firestore().collection('groups').doc(groupId).get();
            if (doc.exists) {
                setGroup(doc.data());
                console.log(doc.data());
                setLoading(false);
            }
        })()
    }, [groupId])

    if (loading) {
        return (
            <div>
                <UnicodeSpinner spinner='boxBounce2'/>
            </div>
        )
    }

    return (
        <div>
            <p>--- Make a wager with {group?.leaderboard?.members[memberId]?.name} ---</p>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <p>
                        Think you'll get more stars?
                    </p>
                    <span>
                        Bet
                        $<WagerInput name="bet" defaultValue={''} ref={register({required: true})}/>
                        {' '}
                        to win
                        $<WagerInput name="toWin" defaultValue={''} ref={register({required: true})}/>
                        {(!submitting && !success) && <AocSubmit value='[Propose]'/>}
                        {submitting && <UnicodeSpinner spinner='boxBounce2'/>}
                    </span>

                    <p>{errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}</p>
                    <p>{success && ('Wager was proposed!')}</p>
                </form>
        </div>
        </div>
    )
};