import styled, {css} from "styled-components";
import {Link} from "react-router-dom";
import React, {useState} from "react";


export const headerTextStyle = css`
    display: inline-block;
    text-decoration: none;
    color: #00cc00;
    font-weight: normal;
    text-shadow: 0 0 2px #00cc00, 0 0 2px #00cc00;
`

export const AocLinkStyles = css`
    color: #009900;
    display: inline-block;
    outline: none;
    text-decoration: none;
    user-select: none;
    
    &:hover, &:focus {
    color: #99ff99;
  }
`

export const AocLink = styled(Link)`
  ${AocLinkStyles}
`

export const AocAnchor = styled.a`
  ${AocLinkStyles}
`

export const AocButton = styled.button`
    ${AocLinkStyles};
    background: transparent;
    border: 0;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
    padding: 0;
    color: #009900;
    cursor: pointer;
    width: 20em;
    justify-content: start;
    text-align: start;
`

const AocRadioSpan = styled.span`
  cursor: pointer;
  user-select: none;
  font-size: inherit;
  &:hover{
    background-color: #19193b;
  }
`

export const Smaller = styled.span`
  font-size: .7em;
  opacity: 0.5
`

export const AocRadio = ({label, onClick, value}) => {
    return (
        <AocRadioSpan onClick={onClick}> [{value ? 'X' : ' '}] {label}</AocRadioSpan>
    )
}
