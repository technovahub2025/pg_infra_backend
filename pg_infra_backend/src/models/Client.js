const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      unique: true,
      index: true,
    },
    contactPerson: { type: String, trim: true, default: '' },
    email: { type: String, trim: true, lowercase: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    companyName: { type: String, trim: true, default: '' },
    segment: {
      type: String,
      enum: ['Residential', 'Commercial', 'Industrial', 'Manufacturing', ''],
      default: '',
      index: true,
    },
    address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Lead', 'Archived'],
      default: 'Active',
      index: true,
    },
    notes: { type: String, trim: true, default: '' },
    projectIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
      },
    ],
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

clientSchema.virtual('projectCount').get(function projectCount() {
  return Array.isArray(this.projectIds) ? this.projectIds.length : 0;
});

module.exports = mongoose.model('Client', clientSchema);
