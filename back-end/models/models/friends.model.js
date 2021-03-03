const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FriendsSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    facebook_id: {
        type: Number,
        default: 0
    },
    facebook_username: {
        type: String,
        default: ''
    },
    facebook_name: {
        type: String,
        default: ''
    },
    facebook_image: {
        type: String,
        default: ''
    },
    image_url: {
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
    last_default_message: {
        type: String,
        default: ''
    },
    last_default_message_time: {
        type: Number,
        default: 0
    },
    connection_status: {
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