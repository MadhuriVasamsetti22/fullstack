const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://time-table-genie.firebaseio.com", // Replace this!
});

const db = admin.firestore();

module.exports = db;
