const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors({ origin: true }));

const roomsRoutes = require("./routes/rooms");

app.use("/api", roomsRoutes);

exports.app = functions.https.onRequest(app);
