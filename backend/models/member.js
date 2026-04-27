const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator').default;

const memberSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

memberSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Member', memberSchema);
