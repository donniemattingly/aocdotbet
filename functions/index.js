const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore()

const getLeaderboard = async (joinCode, session) => {
    const leaderboardId = joinCode.split('-')[0];
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

const createGroupInFirestore = async (adminUid, joinCode, session, leaderboard) => {
    if(!adminUid){
        throw new functions.https.HttpsError('invalid-argument', 'Must Supply user id in request')
    }
    const group = {
        owner: adminUid,
        joinCode: joinCode,
        sessionToken: session,
        leaderboard: leaderboard
    }

    const leaderboardId = joinCode.split('-')[0];

    const doc = await db.collection('groups').doc(leaderboardId).get();

    if(doc.exists){
        throw new functions.https.HttpsError('already-exists', 'A group already exists with this ID');
    } else {
        await db.collection('groups').doc(leaderboard.owner_id).set(group);
    }

    return leaderboardId;
}

const addUserToGroup = async (groupId, uid, aocId) => {
    const group = await getGroup(groupId);
    await group.ref.collection('members').doc(uid).set({aocId, joined: Date.now()})
    const userRef = await db.collection('users').doc(uid).get()
    if(userRef.exists){
        const user = userRef.data();
        const groups = Array.from(new Set([groupId, ...user.groups]))
        await db.collection('users').doc(uid).set({...user, groups})
    }
}

const updateLeaderboardForGroup = async (groupId) => {
    const groupSnapshot = await getGroup(groupId);
    const group = groupSnapshot.data();
    const leaderboard = await getLeaderboard(group.joinCode, group.sessionToken);
    await groupSnapshot.ref.update({leaderboard: leaderboard});

    return leaderboard;
}

const getSnapshotOrThrow = async (collection, doc) => {
    const snapshot = await db.collection(collection).doc(doc).get();
    if(!snapshot.exists){
        throw new functions.https.HttpsError('not-found', `The ${collection}: ${doc} was not found`)
    }

    return snapshot
}

const isUserMemberOfLeaderboardForGroup = async (uid, groupId) => {
    const userSnapshot = await getSnapshotOrThrow('users', uid);
    const groupSnapshot = await getSnapshotOrThrow('groups', groupId);

    const user = userSnapshot.data();
    const group = groupSnapshot.data();


    return !!Object.values(group.leaderboard.members).find(l => l.name = user.name);
}

const getAocIdFromLeaderboard = (name, leaderboard) => {
    const leaderboardEntry = Object.keys(leaderboard.members)
        .map(k => ({aocId: k, ...leaderboard.members[k]}))
        .find(l => l.name = name);
    return leaderboardEntry.aocId;
}

exports.createGroup = functions.https.onCall(async (data, context) => {
    const leaderboard = await getLeaderboard(data.joinCode, data.session);
    const groupId = await createGroupInFirestore(data.uid, data.joinCode, data.session, leaderboard);
    const user = (await getSnapshotOrThrow('users', data.uid)).data()
    const aocId = getAocIdFromLeaderboard(user.name, leaderboard);
    await addUserToGroup(groupId, data.uid, aocId)
});

exports.joinGroup = functions.https.onCall(async (data, context) => {
    const groupId = data.joinCode.split('-')[0];
    const leaderboard = await updateLeaderboardForGroup(groupId)
    const membersSnapshot = await db.collection(`groups/${groupId}/members`).doc(data.uid).get();

    if(membersSnapshot.exists){
        throw new functions.https.HttpsError('already-exists', 'You\'re already in this group');
    }

    if(await isUserMemberOfLeaderboardForGroup(data.uid, groupId)) {
        const user = (await getSnapshotOrThrow('users', data.uid)).data()
        const aocId = getAocIdFromLeaderboard(user.name, leaderboard);
        await addUserToGroup(groupId, data.uid, aocId)
    } else {
        throw new functions.https.HttpsError('failed-precondition',
            'You\'re not a member of the leaderboard associated with this join code');
    }
});