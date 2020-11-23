import './App.css';
import styled from 'styled-components';
import React from "react";
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import {Home} from "./Home";
import {Login} from "./Login";
import {Nav} from "./Nav";

const AppContainer = styled.div`
`

function App() {
    return (
        <AppContainer>
            <Router>
                <Nav/>
                <Switch>
                    <Route exact path='/'>
                        <Home/>
                    </Route>
                    <Route path='/login'>
                        <Login/>
                    </Route>
                </Switch>
            </Router>
        </AppContainer>
    );
}

export default App;
