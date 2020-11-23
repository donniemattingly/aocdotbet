import {action, computed, createStore, thunk} from "easy-peasy";
import firebase from "firebase";

export const store = createStore({
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
        }
        await actions.loadGroupsForUser();
    }),
    loadGroupsForUser: thunk(async (actions, id) => {
        const doc = await firebase.firestore().collection('groups').doc('1').get();
        if(doc.exists){
            console.log(doc.data());
        }
        // const groups = snapshot.map(doc => doc.data())
        // console.log(groups);
        // actions.addGroupsToUser(groups);
    }),
    signOut: thunk(async (actions, payload) => {
        await firebase.auth().signOut();
        actions.setAuth(null);
    })
});