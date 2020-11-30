const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');
const {v4: uuidv4} = require('uuid');

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

    if (response.status > 300) {
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
    if (!doc.exists) {
        throw new functions.https.HttpsError('not-found', `Group ${groupId} does not exist`)
    }

    return doc
}

const createGroupInFirestore = async (adminUid, joinCode, session, leaderboard) => {
    if (!adminUid) {
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

    if (doc.exists) {
        throw new functions.https.HttpsError('already-exists', 'A group already exists with this ID');
    } else {
        await db.collection('groups').doc(leaderboard.owner_id).set(group);
    }

    return leaderboardId;
}

const addUserToGroup = async (groupId, uid, aocId, allowDerivatives) => {
    const group = await getGroup(groupId);
    await group.ref.collection('members').doc(uid).set({uid, aocId, allowDerivatives, joined: Date.now()})
    const userRef = await db.collection('users').doc(uid).get()
    if (userRef.exists) {
        const user = userRef.data();
        const groups = Array.from(new Set([groupId, ...user.groups]))
        await db.collection('users').doc(uid).set({...user, groups})
    }

    await updateLeaderboardForGroup(groupId);
}

const updateLeaderboardForGroup = async (groupId) => {
    const groupSnapshot = await getGroup(groupId);
    const group = groupSnapshot.data();
    const leaderboard = await getLeaderboard(group.joinCode, group.sessionToken);

    const memberSnapshot = await db.collection('groups').doc(groupId).collection('members').get()
    const members = memberSnapshot.docs.map(d => d.data()).reduce((acc, x) => ({...acc, [x.aocId]: x}), {})
    const leaderboardMembersWithUid = Object.keys(leaderboard.members)
        .reduce((acc, x) => (
            {
                ...acc,
                [x]: {
                    ...leaderboard.members[x],
                    uid: (members && members[x] && members[x].uid) || null,
                    allowDerivatives: (members && members[x] && members[x].allowDerivatives) || false
                }
            }
        ), {})
    await groupSnapshot.ref.update({leaderboard: {...leaderboard, members: leaderboardMembersWithUid}});

    return leaderboard;
}

const getSnapshotOrThrow = async (collection, doc) => {
    const snapshot = await db.collection(collection).doc(doc).get();
    if (!snapshot.exists) {
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
        .find(l => l.name === name);
    return (leaderboardEntry && leaderboardEntry.aocId) || null;
}

exports.createGroup = functions.https.onCall(async (data, context) => {
    const leaderboard = await getLeaderboard(data.joinCode, data.session);
    const groupId = await createGroupInFirestore(data.uid, data.joinCode, data.session, leaderboard);
    const user = (await getSnapshotOrThrow('users', data.uid)).data()
    const aocId = getAocIdFromLeaderboard(user.name, leaderboard);
    await addUserToGroup(groupId, data.uid, aocId, true)
});

exports.joinGroup = functions.https.onCall(async (data, context) => {
    const groupId = data.joinCode.split('-')[0];
    const leaderboard = await updateLeaderboardForGroup(groupId)
    const membersSnapshot = await db.collection(`groups/${groupId}/members`).doc(data.uid).get();

    if (membersSnapshot.exists) {
        throw new functions.https.HttpsError('already-exists', 'You\'re already in this group');
    }

    if (await isUserMemberOfLeaderboardForGroup(data.uid, groupId)) {
        const user = (await getSnapshotOrThrow('users', data.uid)).data()
        const aocId = getAocIdFromLeaderboard(user.name, leaderboard);
        await addUserToGroup(groupId, data.uid, aocId, data.allowDerivatives)
    } else {
        throw new functions.https.HttpsError('failed-precondition',
            'You\'re not a member of the leaderboard associated with this join code');
    }
});

exports.createWager = functions.https.onCall(async (data, context) => {
    const {groupId, proposedTo, proposedBy, details} = data;
    const membersSnapshot = await db.collection(`groups/${groupId}/members`).doc(proposedBy).get();
    if (!membersSnapshot.exists) {
        throw new functions.https.HttpsError('unauthenticated', 'You must be a member of the group to create wagers in it.')
    }

    const proposedToSnapshot = await db.collection(`groups/${groupId}/members`).doc(proposedTo).get();
    if (!proposedToSnapshot.exists) {
        throw new functions.https.HttpsError('failed-precondition', 'The other party of the wager isn\'t in this group')
    }

    if (proposedToSnapshot.data().uid === context.auth.uid) {
        // throw new functions.https.HttpsError('failed-precondition', 'You can\'t create a wager with yourself')
    }

    const proposedToUserSnapshot = await db.collection('users').doc(proposedToSnapshot.data().uid).get();
    if (!proposedToUserSnapshot.exists) {
        throw new functions.https.HttpsError('failed-precondition', 'The other party of the wager isn\'t registered');
    }

    const creatingUserSnapshot = await db.collection('users').doc(proposedBy).get();
    if (!creatingUserSnapshot.exists) {
        throw new functions.https.HttpsError('failed-precondition', 'The other party of the wager isn\'t registered');
    }

    const actorUserSnapshot = await db.collection('users').doc(details.actor).get();
    if (!actorUserSnapshot.exists) {
        throw new functions.https.HttpsError('failed-precondition', 'The actor of the wager isn\'t registered');
    }

    let opponentUserSnapshot;
    if (details.opponent) {
        opponentUserSnapshot = await db.collection('users').doc(details.opponent).get();
        if (!opponentUserSnapshot.exists) {
            throw new functions.https.HttpsError('failed-precondition', 'The opponent of the wager isn\'t registered');
        }
    }


    const wagerToSave = {
        id: uuidv4(),
        proposedBy: {
            uid: proposedBy,
            name: creatingUserSnapshot.data().name
        },
        proposedTo: {
            uid: proposedTo,
            name: proposedToUserSnapshot.data().name,
        },
        actor: {
            uid: details.actor,
            name: actorUserSnapshot.data().name,
        },
        opponent: details.opponent ? {
            uid: details.opponent,
            name: opponentUserSnapshot.data().name,
        } : null,
        status: 'pending',
        details: details
    }

    const wagerRef = {
        groupId: groupId,
        ...wagerToSave
    }

    await db.collection('groups')
        .doc(groupId)
        .collection('wagers')
        .doc(wagerToSave.id)
        .set(wagerToSave);

    const path = `wagers.${wagerToSave.id}`

    await db.collection('users')
        .doc(proposedBy)
        .update({[path]: wagerRef})

    await db.collection('users')
        .doc(proposedTo)
        .update({[path]: wagerRef})
})

exports.confirmWager = functions.https.onCall(async (data, context) => {
    const {groupId, wagerId, accept} = data;

    const doc = await db.collection('groups').doc(groupId)
        .collection('wagers').doc(wagerId).get();

    if (!doc.exists) {
        throw new functions.https.HttpsError('failed-precondition', 'This wager doesn\'t exist');
    }

    const wager = doc.data();

    if (wager.proposedTo.uid !== context.auth.uid) {
        throw new functions.https.HttpsError('failed-precondition', 'This user may not accept the wager');
    }

    const newWager = {
        ...wager,
        status: accept ? 'booked' : 'rejected',
        groupId: groupId
    }

    await db.collection('groups')
        .doc(data.groupId)
        .collection('wagers')
        .doc(data.wagerId)
        .set(newWager);


    const path = `wagers.${data.wagerId}`

    await db.collection('users')
        .doc(wager.proposedTo.uid)
        .update({[path]: newWager})

    await db.collection('users')
        .doc(wager.proposedBy.uid)
        .update({[path]: newWager})
});

exports.initWagerTypes = functions.https.onCall(async (data, context) => {
    /*
    * This defines the allowed wager types all wagers are in the format of 'bet x to win y'
    * */
    const wagers = {
        simpleStars: {
            callToAction: 'Think you\'ll get more stars?',
            params: {
                bet: {
                    desc: 'You\'ll bet this amount'
                }
            }
        }
    }
});

exports.keepLeaderboardUpdated = functions.pubsub.schedule('every 15 minutes').onRun(async (context) => {
    const groupsSnapshot = await db.collection('groups').get()
    await Promise.allSettled(groupsSnapshot.docs.map(doc => doc.id)
        .map(updateLeaderboardForGroup))
})