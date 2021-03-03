const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AutoResponderKeywordSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    auto_responder_id: {
        type: Schema.Types.ObjectId,
        ref: 'AutoResponders',
        default: null
    },
    keywords: {
        type: String,
        default: ''
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
// create the model for AutoResponderKeywords and expose it to our app
module.exports = mongoose.model('AutoResponderKeywords', AutoResponderKeywordSchema);