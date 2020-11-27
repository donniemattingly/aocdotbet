import styled from 'styled-components';
import React from "react";
import {headerTextStyle} from "./shared-components";
import {useStoreState} from "easy-peasy";
import {useHistory} from 'react-router-dom'

const HomeContainer = styled.div`
`

export const Home = ({...props}) => {
    const joinCode = useStoreState(state => state.joinCode);
    const history = useHistory();
    console.log(joinCode);
    if(joinCode){
        history.push(`/groups/join/${joinCode}`)
    }
    return (
        <HomeContainer>
            <p>
                Wager with friends on advent of code!
            </p>
            <p>
                Join a group based on an advent of code private leaderboard, and you can propose wagers to
                other members of the group.
            </p>
        </HomeContainer>
    )
}