import styled from 'styled-components';
import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Home} from "./Home";
import {Login} from "./Login";
import {Nav} from "./Nav";
import './firebaseConfig';
import {Groups} from "./Groups";
import {useFirebaseAuth} from "./hooks";

const AppContainer = styled.div`
  width: 100%;
`

const Content = styled.div`
   padding: .6em;
`

function App() {
    useFirebaseAuth();
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
                            <Route path='/groups'>
                                <Groups/>
                            </Route>
                        </Switch>
                    </Content>
                </Router>
            </AppContainer>
    );
}

export default App;
