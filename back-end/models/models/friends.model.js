const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    kyubi_user_token: {
        type: String,
        default: ''
    },
    instagram_user_id: {
        type: String,
        default: ''
    },
    instagram_username: {
        type: String,
        default: ''
    },
    instagram_profile_link: {
        type: String,
        default: ''
    },
    instagram_first_name: {
        type: String,
        default: ''
    },
    instagram_last_name: {
        type: String,
        default: ''
    },
    instagram_image: {
        type: String,
        default: ''
    },
    last_contact_incoming: {
        type: Number,
        default: 0
    },
    last_contact_outgoing: {
        type: Number,
        default: 0
    },
    last_message: {
        type: String,
        default: ''
    },
    last_default_message_time: {
        type: Number,
        default: 0
    },
    connection_type: {
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
// create the model for Friends and expose it to our app
module.exports = mongoose.model('Friends', FriendsSchema);