import styled from 'styled-components';
import React from "react";
import {headerTextStyle} from "./shared-components";

const HomeContainer = styled.div`
`

export const Home = ({...props}) => {
    return (
        <HomeContainer>
            <p>
                Wager with friends on advent of code!
            </p>
        </HomeContainer>
    )
}