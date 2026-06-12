const mongoose = require('mongoose');

const TimesheetFilterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    scope: {
      type: String,
      enum: ['mine', 'employee'],
      default: 'mine',
      index: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    preset: {
      type: String,
      trim: true,
      default: '',
    },
    start: { type: Date },
    end: { type: Date },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      index: true,
    },
    entryType: {
      type: String,
      enum: ['all', 'manual', 'automatic'],
      default: 'all',
    },
    billable: {
      type: String,
      enum: ['all', 'billable', 'non-billable'],
      default: 'all',
    },
    search: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true },
);

TimesheetFilterSchema.index({ user: 1, scope: 1, name: 1 });
TimesheetFilterSchema.index({ user: 1, scope: 1, updatedAt: -1 });

module.exports = mongoose.model('TimesheetFilter', TimesheetFilterSchema);
