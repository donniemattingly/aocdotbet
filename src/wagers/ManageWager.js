import {useParams, useHistory} from "react-router-dom";
import {UnicodeSpinner} from "../UnicodeSpinner";
import React, {useEffect, useState} from "react";
import {useStoreActions, useStoreState} from "easy-peasy";
import {getWagerDescription} from "./WagerRow";
import firebase from "firebase";
import {AocButton} from "../shared-components";
import {ErrorMessage} from "../groups/JoinGroup";
import {FinePrint} from "../FinePrint";

const getWager = async (groupId, wagerId) => {
    const doc = await firebase.firestore()
        .collection('groups')
        .doc(groupId)
        .collection('wagers')
        .doc(wagerId).get();

    if (doc.exists) {
        return doc.data();
    }
}

const submitResponseToWager = async (groupId, wagerId, accept) => {
    await firebase.functions().httpsCallable('confirmWager')({groupId, wagerId, accept})
}

export const ManageWager = ({...props}) => {
    const {groupId, wagerId} = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({});
    const [wager, setWager] = useState({})
    const auth = useStoreState(state => state.auth);
    const setCounterWager = useStoreActions(actions => actions.setCounterWager)
    const history = useHistory();
    const proposedByMe = wager?.proposedBy?.uid === auth?.id;
    const proposedToMe = wager?.proposedTo?.uid === auth?.id;

    const respondToWager = async (accept, options = {}) => {
        const {counter} = options;
        setSubmitting(true);
        try {
            await submitResponseToWager(groupId, wagerId, accept);
            setStatus({success: true})
        } catch (error) {
            setStatus({error: true, message: error.message})
            setSubmitting(false)
        }
        setSubmitting(false);
    }

    useEffect(() => {
        (async () => {
            const wager = await getWager(groupId, wagerId)
            setWager(wager)
            console.log(wager);
            setLoading(false);
        })()
    }, [groupId, wagerId])

    if (loading) {
        return (
            <div>
                <UnicodeSpinner spinner='boxBounce2'/>
            </div>
        )
    }

    return (
        <div>
            <div>
                <span>
                    {wager.status === 'pending' ? 'Pending: ' : 'Booked: '}
                </span>
                {getWagerDescription(wager, auth)}
            </div>
            <br/>
            <div>
                {(proposedToMe && wager.status === 'pending' && !submitting && !status.success) &&
                <span>
                    <AocButton onClick={() => respondToWager(true)}> [Confirm this Wager] </AocButton>
                    <AocButton onClick={() => respondToWager(false)}> [Reject this Wager] </AocButton>
                    <AocButton onClick={() => respondToWager(false, {counter: true})}> [Counter this Wager] </AocButton>
                </span>
                }

                {(proposedByMe && wager.status === 'pending' && !submitting && !status.success) &&
                <span>
                    <AocButton onClick={() => respondToWager(false)}> [Rescind this Wager] </AocButton>
                </span>
                }
                {submitting && <UnicodeSpinner spinner='boxBounce2'/>}
                {status.success && 'You responded to the wager!'}
                {status.error && <ErrorMessage> {status.message} </ErrorMessage>}
            </div>
            <br/>
            <br/>
            <FinePrint/>
        </div>
    )
}