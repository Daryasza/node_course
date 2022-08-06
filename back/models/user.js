var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: { type: String, required: true },
    firstName: String,
    middleName: String,
    surName: String,
    // in frontend part, both variables are used periodically
    avatar: { type: String, default: '' },
    image: { type: String, default: '' },
    permission: {
        chat: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        news: { C: Boolean, R: Boolean, U: Boolean, D: Boolean },
        settings: { C: Boolean, R: Boolean, U: Boolean, D: Boolean }
    },
    passwordHash: { type: String, required: true }
  },
  { id: true }
);

module.exports = mongoose.model('User', UserSchema, 'users');
