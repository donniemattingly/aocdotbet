import styled from 'styled-components';
import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Home} from "./Home";
import {Login} from "./Login";
import {Nav} from "./Nav";
import './firebaseConfig';
import {Groups} from "./groups/Groups";
import {useFirebaseAuth} from "./hooks";
import {CreateGroup} from "./groups/CreateGroup";
import {Group} from "./groups/Group";
import {Me} from "./Me";
import {JoinGroup} from "./groups/JoinGroup";

const AppContainer = styled.div`
  width: 100%;
  max-width: 70em;
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
                            <Route exact path='/groups'>
                                <Groups/>
                            </Route>
                            <Route path='/groups/create'>
                                <CreateGroup/>
                            </Route>
                            <Route exact path='/groups/join'>
                                <JoinGroup/>
                            </Route>
                            <Route path='/groups/join/:joinCode'>
                                <JoinGroup/>
                            </Route>
                            <Route exact path='/groups/:groupId'>
                                <Group/>
                            </Route>
                            <Route exact path='/me'>
                                <Me/>
                            </Route>
                        </Switch>
                    </Content>
                </Router>
            </AppContainer>
    );
}

export default App;
