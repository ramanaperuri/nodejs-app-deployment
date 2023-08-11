const logger = require("./logger");
const config = require("../config/config.json");

const mongoose = require("mongoose");

module.exports.connectToMongoDB = function () {
  mongoose.set("strictQuery", true);

  logger.info("connecting to mongoDB ...");

  mongoose.connect(config.mongodb.url, config.mongodb.options);
  const conn = mongoose.connection;

  conn.on("error", (err) => {
    logger.error(err);
  });

  conn.once("open", function () {
    logger.info("connected to mongoDB");
  });
};
