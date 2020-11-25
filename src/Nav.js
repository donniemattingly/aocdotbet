import styled from "styled-components";
import React from "react";
import {Link} from "react-router-dom";
import {useStoreActions, useStoreState} from "easy-peasy";
import {AocButton, AocLink, AocLinkStyles} from "./shared-components";

export const Heading = styled.span`
    display: inline-block;
    text-decoration: none;
    color: #00cc00;
    text-shadow: 0 0 2px #00cc00, 0 0 2px #00cc00;
    padding: 0.6em;
    font-weight: normal;
`

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 0;
  width: 100%;
`

const NavItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const NavItemContainer = styled.span`
    padding: .6em;
`

const NavItem = ({to, title, onClick}) => {
    if (onClick) {
        return (
            <NavItemContainer>
                <AocButton onClick={onClick}> [{title}] </AocButton>
            </NavItemContainer>
        )
    } else {
        return (
            <NavItemContainer>
                <AocLink key={to} to={to}>[{title}]</AocLink>
            </NavItemContainer>
        )
    }
}

export const Nav = ({...props}) => {
    const links = [
        ['/me', 'Me'],
        ['/groups', 'Groups']
    ]

    const loggedIn = useStoreState(state => state.loggedIn);
    const signOut = useStoreActions(actions => actions.signOut);

    return (
        <NavContainer>
            <Link to={'/'}>
                <Heading>
                    aoc.bet
                </Heading>
            </Link>
            <NavItemsContainer>
                {links.map(([to, title]) => <NavItem key={to} to={to} title={title}/>)}
                <NavItem onClick={loggedIn ? signOut : undefined} to={loggedIn ? undefined : '/login'} title={`Log ${loggedIn ? 'Out' : 'In'}`}/>
            </NavItemsContainer>
        </NavContainer>
    )
}