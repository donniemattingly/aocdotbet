import styled from 'styled-components';
import React from "react";
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import {Home} from "./Home";
import {Login} from "./Login";
import {Nav} from "./Nav";
import './firebaseConfig';

const AppContainer = styled.div`
  width: 100%;
`

const Content = styled.div`
   padding: .6em;
`

function App() {
    return (
        <AppContainer>
            <Router>
                <Nav/>
                <Content>
                    <Switch>
                        <Route exact path='/'>
                            <Home/>
                        </Route>
                        <Route path='/login'>
                            <Login/>
                        </Route>
                    </Switch>
                </Content>
            </Router>
        </AppContainer>
    );
}

export default App;
