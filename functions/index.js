const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore()

const getLeaderboard = async (leaderboardId, session) => {
    const response = await axios.request({
        method: 'get',
        url: `https://adventofcode.com/2020/leaderboard/private/view/${leaderboardId}.json`,
        headers: {
            Cookie: `session=${session}`
        },
        validateStatus: null
    })

    if(response.status > 300){
        throw new functions.https.HttpsError('invalid-argument', 'Either the leaderboard or the session was invalid.')
    }

    if (response.headers['content-type'] !== 'application/json') {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Either your session is incorrect or you do not have access to this leaderboard'
        )
    }

    return response.data;
}

const getGroup = async (groupId) => {
    const doc = await db.collection('groups').doc(groupId).get();
    if(!doc.exists){
        throw new functions.https.HttpsError('not-found', `Group ${groupId} does not exist`)
    }

    return doc
}

const createGroupInFirestore = async (adminUid, session, leaderboard) => {
    if(!adminUid){
        throw new functions.https.HttpsError('invalid-argument', 'Must Supply user id in request')
    }
    const group = {
        owner: adminUid,
        sessionToken: session,
        leaderboard: leaderboard
    }

    console.log(leaderboard.owner_id);
    console.log(group);

    const doc = await db.collection('groups').doc(leaderboard.owner_id).get();

    if(doc.exists){
        throw new functions.https.HttpsError('already-exists', 'A group already exists with this ID');
    } else {
        await db.collection('groups').doc(leaderboard.owner_id).set(group);
    }
}

const addUserToGroup = async (groupId, uid) => {
    const group = await getGroup(groupId);
    await group.ref.collection('members').doc(uid).set({joined: Date.now()})
    const userRef = await db.collection('users').doc(uid).get()
    if(userRef.exists){
        const user = userRef.data();
        const groups = user.groups;
        await db.collection('users').doc(uid).set({...user, groups: [groupId, ...groups]})
    }
}

exports.createGroup = functions.https.onCall(async (data, context) => {
    const leaderboard = await getLeaderboard(data.groupId, data.session);
    await createGroupInFirestore(data.uid, data.session, leaderboard);
    await addUserToGroup(data.groupId, data.uid)
});
