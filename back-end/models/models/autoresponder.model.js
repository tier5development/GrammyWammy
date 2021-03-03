const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoResponderSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    auto_responder_name: {
        type: String,
        default: ''
    },
    message: {
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
// create the model for AutoResponder and expose it to our app
module.exports = mongoose.model('AutoResponders', AutoResponderSchema);