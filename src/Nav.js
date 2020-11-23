import styled from "styled-components";
import React from "react";
import {Link} from "react-router-dom";

const Heading = styled.span`
    display: inline-block;
    text-decoration: none;
    color: #00cc00;
    text-shadow: 0 0 2px #00cc00, 0 0 2px #00cc00;
    
    font-weight: normal;
`

const NavContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 0;
`

const NavItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
`

const NavItem = styled(Link)`
    text-decoration: none;
    color: #009900;
    
    font-size: 1.3em;
    
    display: inline-block;
    outline: none;
    
    padding: .6em;
    
    &:hover, &:focus {
    color: #99ff99;
  }
`

export const Nav = ({...props}) => {
    const links = [
        ['login', 'Log In'],
        ['me', 'Me'],
        ['groups', 'Groups']
    ]
    return (
        <NavContainer>
            <NavItem to={'/'}>
                <Heading>
                    aoc.bet
                </Heading>
            </NavItem>
            <NavItemsContainer>
                {links.map(([to, title]) => <NavItem to={to}>[{title}]</NavItem>)}
            </NavItemsContainer>
        </NavContainer>
    )
}