import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom"
import firebase from "firebase";
import {UnicodeSpinner} from "../UnicodeSpinner";
import styled from 'styled-components';

const HalfDay = styled.span`
  color: #9999cc
`

const FullDay = styled.span`
  color: #ffff66
`

const NoneOnDay = styled.span`
  color: #333333
`

const completionLevelsToStars = (completionLevels) => {
    return [...Array(25).keys()]
        .map(k => k + 1)
        .map(dayNum => {
            const day = completionLevels[dayNum];
            if(day && day[1]){
                if(day[2]){
                    return <FullDay>*</FullDay>
                } else {
                    return <HalfDay>*</HalfDay>
                }
            } else {
                return <NoneOnDay>*</NoneOnDay>
            }
        })
}

const GroupMemberContainer = styled.tr`
  
`

const GroupMemberCell = styled.td`
  padding-right: 0.5em;
`

const GroupMemberName = styled.span`

`
const GroupMember = ({member, rank}) => {
    return (
        <GroupMemberContainer>
            <GroupMemberCell> {rank + 1}{' '} </GroupMemberCell>
            <GroupMemberCell>{member.name}</GroupMemberCell>
            <GroupMemberCell>{completionLevelsToStars(member.completion_day_level)}</GroupMemberCell>
        </GroupMemberContainer>
    )
}

const MemberRowsContainer = styled.table`

`

export const Group = ({...props}) => {
    const {groupId} = useParams();
    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);

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

    const members = Object.values(group.leaderboard.members);
    members.sort((a, b) => b.local_score - a.local_score)
    return (
        <div>
         <p>
             --- Leaderboard ---
         </p>
        <MemberRowsContainer>
            {members.map((member, idx) => <GroupMember rank={idx} member={member}/>)}
        </MemberRowsContainer>
        </div>
    )
};