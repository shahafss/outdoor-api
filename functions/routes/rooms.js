const express = require("express");

const roomsController = require("../controllers/rooms");

const router = express.Router();

router.get("/rooms", roomsController.getRooms);
router.get("/rooms/:room_id", roomsController.getRoom);
router.post("/create", roomsController.createRoom);
router.put("/update/:room_id", roomsController.updateRoom);
router.delete("/delete/:room_id", roomsController.deleteRoom);

module.exports = router;
