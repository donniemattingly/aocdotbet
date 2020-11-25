import {action, computed, createStore, thunk, debug, persist} from "easy-peasy";
import firebase from "firebase";

export const store = createStore(persist({
    joinCode: null,
    setJoinCode: action((state, joinCode) => {
        console.log(joinCode);
        state.joinCode = joinCode;
    }),
    auth: {loggedIn: false},
    loggedIn: computed(state => state.auth?.loggedIn ?? false),
    setAuth: action((state, firebaseUser) => {
        if (firebaseUser) {
            state.auth = {
                loggedIn: true,
                name: firebaseUser.displayName,
                id: firebaseUser.uid,
            }
        } else {
            state.auth = {loggedIn: false}
        }
    }),
    user: {},
    setUser: action((state, user) => {
        state.user = user
    }),
    addGroupsToUser: action((state, groups) => {
        state.user.groups = groups;
    }),
    loadUser: thunk(async (actions, id) => {
        const doc = await firebase.firestore().collection('users').doc(id).get();
        if (doc.exists) {
            const user = doc.data();
            actions.setUser(user);
            return user;
        }
    }),
    loadGroup: thunk(async (actions, groupId) => {
        const doc = await firebase.firestore().collection('groups').doc(groupId).get();
        if (doc.exists) {
            console.log(doc.data());
        }
    }),
    signIn: thunk(async (actions, firebaseUser) => {
        console.log('signing in');
        actions.setAuth(firebaseUser);
        const user = await actions.loadUser(firebaseUser.uid);
        if (!user) {
            await actions.saveUser(firebaseUser);
        }
    }),
    saveUser: thunk(async (actions, firebaseUser) => {
        const user = {
            name: firebaseUser.displayName,
            groups: []
        }
        await firebase.firestore().collection('users').doc(firebaseUser.uid).set(user);
        actions.setUser(user);
    }),
    wipeStore: action(state => {
        console.log('wiping state');
        console.log(debug(state));
        return {joinCode: state.joinCode, auth: {loggedIn: false}}
    }),
    signOut: thunk(async (actions, payload) => {
        await firebase.auth().signOut();
        actions.wipeStore();
    })
}));