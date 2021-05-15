const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    kyubi_user_token: {
        type: String,
        default: ''
    },
    instagram_fbid: {
        type: Number,
        default: 0
    },
    instagram_id: {
        type: Number,
        default: 0
    },
    instagram_name: {
        type: String,
        default: ''
    },
    instagram_profile_name: {
        type: String,
        default: ''
    },
    instagram_image: {
        type: String,
        default: ''
    },
    image_url: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 0,
        enum: [0, 1]
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    }
});
// create the model for Users and expose it to our app
module.exports = mongoose.model('Users', UsersSchema);