const mongoose = require('mongoose');

const { Schema } = mongoose.Schema;

const requiredString = {
  type: String,
  required: true,
};

const requiredNumber = {
  type: Number,
  required: true,
};

const defaultDate = {
  type: Date,
  default: Date.now,
  required: true,
};

const logEntrySchema = new mongoose.Schema({
  title: requiredString,
  description: String,
  comments: String,
  ratings: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  image: String,
  start_date: Date,
  end_date: Date,
  latitude: {
    ...requiredNumber,
    min: -90,
    max: 90,
  },
  longitude: {
    ...requiredNumber,
    min: -180,
    max: 180,
  },
  visitDate: defaultDate,
},
{
  timestamps: true,
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;
