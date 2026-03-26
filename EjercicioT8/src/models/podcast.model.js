import mongoose from 'mongoose';

const podcastSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 3
  },
  description: {
    type: String,
    required: true,
    minlength: 10
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['tech', 'science', 'history', 'comedy', 'news']
  },
  duration: {
    type: Number,
    required: true,
    min: 60
  },
  episodes: {
    type: Number,
    default: 1
  },
  published: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    timestamps: true
  }
});

const Podcast = mongoose.model('Podcast', podcastSchema);

export default Podcast;