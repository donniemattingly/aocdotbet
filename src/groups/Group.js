import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom"
import firebase from "firebase";
import {UnicodeSpinner} from "../UnicodeSpinner";
import styled from 'styled-components';
import {AocLink} from "../shared-components";
import {Heading} from "../Nav";
import {WagerRow} from "../wagers/WagerRow";

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
            if (day && day[1]) {
                if (day[2]) {
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
    const {groupId} = useParams()
    return (
        <GroupMemberContainer>
            <GroupMemberCell> {rank + 1}{' '} </GroupMemberCell>
            <GroupMemberCell>
                {member.uid && <AocLink to={`/groups/${groupId}/members/${member.id}`}>{member.name}</AocLink>}
                {!member.uid && member.name}
            </GroupMemberCell>
            <GroupMemberCell>{completionLevelsToStars(member.completion_day_level)}</GroupMemberCell>
        </GroupMemberContainer>
    )
}

const MemberRowsContainer = styled.table`

`

export const Group = ({...props}) => {
    const {groupId} = useParams();
    const [group, setGroup] = useState(null);
    const [wagers, setWagers] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const doc = await firebase.firestore().collection('groups').doc(groupId).get();
            if (doc.exists) {
                setGroup(doc.data());
            }
            const wagersSnapshot = await firebase.firestore().collection('groups').doc(groupId).collection('wagers').get();
            setWagers(wagersSnapshot.docs.map(doc => doc.data()))

            setLoading(false);
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

    const openWagers = wagers.filter(wager => ['open'].includes(wager.status));
    return (
        <div>
            <p>
                --- Open Wagers --- <AocLink to={`/groups/${groupId}/wagers/open`}>[Create an Open Wager]</AocLink>
            </p>
            {openWagers.length > 0 && <p>
                Here are the open wagers for this group
            </p>}
            <div>
                {openWagers.map(wager => <WagerRow wager={wager} auth={null} linkToWager={false}/>)}
            </div>
            <p>
                --- Leaderboard ---
            </p>
            <p>
                As members of your private leaderboard join <AocLink to={'/'}>aoc.bet</AocLink> you will be able to make
                wagers with them.
            </p>

            <MemberRowsContainer>
                <tbody>
                {members.map((member, idx) => <GroupMember rank={idx} member={member}/>)}
                </tbody>
            </MemberRowsContainer>

            <p>
                --- Wagers ---
            </p>
            <p>
                Here are the pending and booked wagers for this group
            </p>
            <div>
                {wagers.filter(wager => ['booked', 'pending'].includes(wager.status)).map(wager => <WagerRow wager={wager} auth={null} linkToWager={false}/>)}
            </div>
        </div>
    )
};