import {UnicodeSpinner} from "../UnicodeSpinner";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import firebase from "firebase";
import {useStoreState} from "easy-peasy";
import {BaseWager} from "./BaseWager";

export const OpenWager = ({...props}) => {
    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState(null);
    const {memberId, groupId} = useParams();
    const auth = useStoreState(state => state.auth)

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
            <p>--- Make an open wager ---</p>
            <BaseWager
                group={group}
                myUid={auth.id}
                groupId={groupId}
                isOpenWager={true}
            />
        </div>
    )
};