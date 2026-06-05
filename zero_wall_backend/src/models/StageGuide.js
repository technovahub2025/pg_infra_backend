const mongoose = require('mongoose');

const stageGuideSchema = new mongoose.Schema(
  {
    stageNo: { type: String, required: true, trim: true, index: true },
    stageName: { type: String, required: true, trim: true },
    stageDescription: { type: String, trim: true, default: '' },
    keyDeliverables: { type: String, trim: true, default: '' },
    approvalRequired: { type: String, trim: true, default: '' },
    disciplines: { type: String, trim: true, default: '' },
    duration: { type: String, trim: true, default: '' },
    sequenceOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

stageGuideSchema.index({ sequenceOrder: 1, stageNo: 1 });

module.exports = mongoose.model('StageGuide', stageGuideSchema);
