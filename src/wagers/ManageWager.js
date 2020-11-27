import {useParams} from "react-router-dom";
import {UnicodeSpinner} from "../UnicodeSpinner";
import {useEffect, useState} from "react";
import {useStoreState} from "easy-peasy";
import {getWagerDescription} from "./WagerRow";
import firebase from "firebase";
import {AocButton} from "../shared-components";
import {ErrorMessage} from "../groups/JoinGroup";

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

const confirmWager = async (groupId, wagerId) => {
    await firebase.functions().httpsCallable('confirmWager')({groupId, wagerId})
}

export const ManageWager = ({...props}) => {
    const {groupId, wagerId} = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({});
    const [wager, setWager] = useState(null)
    const auth = useStoreState(state => state.auth);
    const proposedByMe = wager?.proposedBy.uid === auth?.id;

    const doConfirmWager = async () => {
        setSubmitting(true);
        try {
            await confirmWager(groupId, wagerId);
            setStatus({success: true})
        } catch(error){
            setStatus({error: true, message: error.message})
            setSubmitting(false)
        }
        setSubmitting(false);
    }

    useEffect(() => {
        (async () => {
            const wager = await getWager(groupId, wagerId)
            setWager(wager)
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
                {(!proposedByMe && wager.status === 'pending' && !submitting && !status.success) &&
                <AocButton onClick={() => doConfirmWager()}> [Confirm this Wager] </AocButton>
                }
                {submitting && <UnicodeSpinner spinner='boxBounce2'/>}
                {status.success && 'You confirmed the wager!'}
                {status.error && <ErrorMessage> {status.message} </ErrorMessage>}
            </div>
        </div>
    )
}