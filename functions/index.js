const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true }));

var serviceAccount = require("./permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://outdoor-vue.firebaseio.com",
});

const db = admin.firestore();

app.get("/api/rooms", (req, res) => {
  (async () => {
    try {
      let query = db.collection("rooms");
      let tempRooms = [];
      await query.get().then((querySnapshot) => {
        let docs = querySnapshot.docs;
        for (let doc of docs) {
          const roomData = {
            id: doc.id,
            title: doc.data().title,
            category: doc.data().category,
            date: doc.data().date,
            description: doc.data().description,
            participants: doc.data().participants,
            address: doc.data().address,
            admin: doc.data().admin,
            joinedUsers: doc.data().joinedUsers,
            messages: doc.data().messages,
            timestamp: doc.data().timestamp,
          };
          if (roomData.title !== undefined) tempRooms.push(roomData);
        }
      });
      tempRooms.sort((a, b) => new Date(a.timestamp - b.timestamp)).reverse();
      return res.status(200).send(tempRooms);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.get("/api/rooms/:room_id", (req, res) => {
  console.log("getroom requ>>", req.params);
  (async () => {
    try {
      const document = db.collection("rooms").doc(req.params.room_id);
      let item = await document.get();
      let response = item.data();
      return res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

app.post("/api/create", (req, res) => {
  console.log("request>> ", req.body);
  const room = req.body;
  (async () => {
    try {
      await db
        .collection("rooms")
        .add(room)
        .then((docRef) => {
          return res.status(200).send(docRef.id);
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
});

exports.app = functions.https.onRequest(app);
