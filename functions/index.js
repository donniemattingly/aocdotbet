const functions = require('firebase-functions');
const axios = require('axios');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const getLeaderboard = async (leaderboardId, session) => {
    try {

        const response = await axios.request({
            method: 'get',
            url: `https://adventofcode.com/2020/leaderboard/private/view/${leaderboardId}.json`,
            headers: {
                Cookie: `session=${session}`
            }
        })

        console.log(response.data);
    } catch (error) {
        throw new functions.https.HttpsError('invalid-argument', 'Either the leaderboard or the session was invalid.')
    }
}

exports.createGroup = functions.https.onCall(async (data, context) => {
    await getLeaderboard(data.groupId, data.sessionId);

});
