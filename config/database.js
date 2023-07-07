const mongoose = require('mongoose');

require('dotenv').config();

const connectionURL = process.env.MONGO_URI;

const connection = mongoose.createConnection(connectionURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username:String,
    hash:String,
    salt:String
})

const User = connection.model('User',UserSchema);

module.exports = connection