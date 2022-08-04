var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TokenSchema = new Schema(
  {
    accessToken: String,
    refreshToken: String,
    accessTokenExpiredAt: Date,
    refreshTokenExpiredAt: Date,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { id: true }
);

module.exports = mongoose.model('Token', TokenSchema, 'tokens');
