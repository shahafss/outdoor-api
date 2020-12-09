const admin = require("firebase-admin");

var serviceAccount = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://outdoor-vue.firebaseio.com",
});

const db = admin.firestore();

exports.getRooms = (req, res) => {
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
      return res.status(200).json({ rooms: tempRooms });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.getRoom = (req, res) => {
  console.log("getroom request>>", req.params);
  (async () => {
    try {
      const document = db.collection("rooms").doc(req.params.room_id);
      let item = await document.get();
      let response = item.data();
      return res.status(200).json({ room: response });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.createRoom = (req, res) => {
  console.log("create request>> ", req.body);
  const room = req.body;
  (async () => {
    try {
      await db
        .collection("rooms")
        .add(room)
        .then((docRef) => {
          return res.status(201).send({ roomId: docRef.id });
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  })();
};

exports.updateRoom = (req, res) => {
  (async () => {
    try {
      const document = db.collection("rooms").doc(req.params.room_id);
      await document.update(req.body);
      return res.status(200).send("room updated");
    } catch (error) {
      return res.status(500).send(error);
    }
  })();
};

exports.deleteRoom = (req, res) => {
  (async () => {
    try {
      const document = db.collection("rooms").doc(req.params.room_id);
      await document.delete();
      return res.status(200).send("room deleted");
    } catch (error) {
      console.log("delete room error >> ", error);
      return res.status(500).send(error);
    }
  })();
};
