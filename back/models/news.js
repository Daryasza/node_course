var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NewsSchema = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { id: true }
);

module.exports = mongoose.model('News', NewsSchema, 'news');
