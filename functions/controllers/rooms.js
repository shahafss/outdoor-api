const Room = require("../models/room");

const admin = require("firebase-admin");

const db = admin.firestore();

exports.createRoom = (req, res) => {
  const room = new Room(req.body);
  room.save((response) => {
    return res.status(201).send(response);
  });
};

exports.getRoom = (req, res) => {
  Room.fetchCurrenRoom(req.params.room_id, (room) => {
    return res.status(200).json(room);
  });
};

exports.getRooms = (req, res) => {
  Room.fetchAllRooms((rooms) => {
    if (rooms.length) return res.status(200).json({ rooms: rooms });
    return res
      .status(500)
      .send("connection error. please check your internet connection.");
  });
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
  Room.delete(req.params.room_id, (response) => {
    return res.status(200).send(response);
  });
};
