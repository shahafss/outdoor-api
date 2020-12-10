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
  }

  save(callback) {
    const self = JSON.stringify(this);
    (async () => {
      try {
        await db
          .collection("rooms")
          .add(JSON.parse(self))
          .then((docRef) => {
            callback({ roomId: docRef.id });
          });
      } catch (error) {
        console.log(error);
        callback(error);
      }
    })();
  }

  static fetchCurrenRoom(roomId, callback) {
    (async () => {
      try {
        const document = db.collection("rooms").doc(roomId);
        let item = await document.get();
        let response = item.data();
        callback({ room: response });
      } catch (error) {
        console.log("getRoom error >> ", error);
        callback({ err: error });
      }
    })();
  }

  static fetchAllRooms(callback) {
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
        callback(tempRooms);
      } catch (error) {
        console.log("errrrr>>>>> ", error);
        callback(error);
      }
    })();
  }

  static delete(roomId, callback) {
    (async () => {
      try {
        const document = db.collection("rooms").doc(roomId);
        await document.delete();
        callback("room deleted");
      } catch (error) {
        console.log("delete room error >> ", error);
        callback(error);
      }
    })();
  }
};
