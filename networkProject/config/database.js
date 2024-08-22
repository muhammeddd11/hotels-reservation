const mongoose = require('mongoose');

// Connect With DB
const dbConnection = () => {
  mongoose.connect(process.env.DB_URI)
.then(() => console.log(`Mongo DB Connected`))
}
  
  module.exports = dbConnection;
  

