import styled from 'styled-components';
import React from "react";

const HomeContainer = styled.div`

`

export const Home = ({...props}) => {
    return (
        <HomeContainer>
            <h1> aoc.bet </h1>
            <p>
                Wager with friends on advent of code!
            </p>
        </HomeContainer>
    )
}