import {action, computed, createStore, thunk} from "easy-peasy";
import firebase from "firebase";

export const store = createStore({
    auth: {loggedIn: false},
    loggedIn: computed(state => state.auth.loggedIn),
    setAuth: action((state, firebaseUser) => {
        console.log(firebaseUser);
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
    setUser: action((state, user) => state.user = user),
    loadUser: thunk(async (actions, id) => {
        const doc = await firebase.firestore().collection('users').doc(id).get();
        console.log(doc);
        if (doc.exists) {
            console.log(doc.data());
            actions.setUser(doc.data());
        }
    }),
    signOut: thunk(async (actions, payload) => {
        await firebase.auth().signOut();
        actions.setAuth(null);
    })
});