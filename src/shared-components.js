import styled, {css} from "styled-components";


export const headerTextStyle = css`
    display: inline-block;
    text-decoration: none;
    color: #00cc00;
    font-weight: normal;
    text-shadow: 0 0 2px #00cc00, 0 0 2px #00cc00;
`

export const AocButton = styled.a`
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
