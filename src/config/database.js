const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Database Connection
const connection = () =>
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log('DB connected successfully ✅');
    })
    .catch((err) =>
      console.log({
        err,
      }),
    );

module.exports = { connection };
