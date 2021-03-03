const mongoose = require('mongoose');
/**
  * Defining the db name, hosts, user and password for setting up mongo db connection
*/
module.exports = async () => {
  try {
    await mongoose.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_DATABASE, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true 
    });
    mongoose.set('useFindAndModify', false);
    console.log('Yes, Mongo DB connected successfully, have fun!');
  } catch (error) {
    console.error('I am in mongo db connection error block :: ', error);
  }
}