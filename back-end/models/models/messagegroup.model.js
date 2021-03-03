const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageGroupSchema = new Schema({
   message_group_name: {
        type: String,
        default: ''
    },
    message_group_description: {
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
// create the model for MessageGroup and expose it to our app
module.exports = mongoose.model('MessageGroups', MessageGroupSchema);