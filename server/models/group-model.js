// models/group-model.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Group', groupSchema);
