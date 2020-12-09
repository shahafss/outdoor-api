const admin = require("firebase-admin");
const db = admin.firestore();

module.exports = class Room {
  constructor(t) {
    this.title = t;
  }

  // createRoom() {

  // }
  static fetchAllRooms() {
    return;
  }
};
