import {UnicodeSpinner} from "../UnicodeSpinner";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import firebase from "firebase";

export const GroupMember = ({...props}) => {
    const [loading, setLoading] = useState(false);
    const [group, setGroup] = useState(null);
    const {memberId, groupId} = useParams();

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
        </div>
    )
};