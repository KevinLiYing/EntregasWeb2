import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    material: { type: String },
    hours: { type: Number },
    quantity: { type: Number },
    description: { type: String }
  },
  { _id: false }
);

const deliveryNoteSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true
    },
    format: {
      type: String,
      enum: ['material', 'hours'],
      required: true
    },
    entries: {
      type: [entrySchema],
      required: true
    },
    workDate: {
      type: Date,
      required: true
    },
    signed: {
      type: Boolean,
      default: false
    },
    signatureUrl: {
      type: String
    },
    pdfUrl: {
      type: String
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('DeliveryNote', deliveryNoteSchema);
