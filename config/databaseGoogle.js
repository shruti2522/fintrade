const mongoose = require('mongoose');

require('dotenv').config();

const connectionURL = process.env.MONGO_URI;

const gconnection = mongoose.createConnection(connectionURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    _id:String,
    username:String,
    name:String,
    hash:String,
    salt:String
})


const GoogleUser = gconnection.model('GoogleUser',UserSchema);

module.exports = gconnection