import styled, {css} from "styled-components";
import {Link} from "react-router-dom";


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
