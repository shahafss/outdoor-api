const admin = require("firebase-admin");

var serviceAccount = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://outdoor-vue.firebaseio.com",
});

const db = admin.firestore();

module.exports = class Room {
  constructor(room) {
    this.title = room.title;
    this.description = room.description;
    this.category = room.category;
    this.date = room.date;
    this.participants = room.participants;
    this.address = room.address;
    this.joinedUsers = room.joinedUsers;
    this.messages = room.messages;
    this.admin = room.admin;
    this.id = room.id || null;
  }

  save(callback) {
    const self = JSON.stringify(this);
    (async () => {
      await db
        .collection("rooms")
        .add(JSON.parse(self))
        .then((docRef) => {
          return callback({ roomId: docRef.id });
        })
        .catch((err) => {
          return callback({ error: err });
        });
    })();
  }

  update(callback) {
    const self = JSON.stringify(this);

    (async () => {
      const document = db.collection("rooms").doc(this.id);
      await document
        .update(JSON.parse(self))
        .then((docRef) => {
          return callback("room updated");
        })
        .catch((error) => {
          return callback({ error: error });
        });
    })();
  }

  static fetchCurrenRoom(roomId, callback) {
    (async () => {
      const document = db.collection("rooms").doc(roomId);
      let item = await document
        .get()
        .then((docRef) => {
          let response = docRef.data();
          return callback({ room: response });
        })
        .catch((error) => {
          return callback({ error: error });
        });
    })();
  }

  static fetchAllRooms(callback) {
    (async () => {
      let query = db.collection("rooms");
      let tempRooms = [];
      await query
        .get()
        .then((querySnapshot) => {
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
          tempRooms
            .sort((a, b) => new Date(a.timestamp - b.timestamp))
            .reverse();
          return callback(tempRooms);
        })
        .catch((error) => {
          return callback({ error: error });
        });
    })();
  }

  static delete(roomId, callback) {
    (async () => {
      const document = db.collection("rooms").doc(roomId);
      await document
        .delete()
        .then((docRef) => {
          return callback({ docRef: "room deleted" });
        })
        .catch((error) => {
          return callback({ error: error });
        });
    })();
  }
};
