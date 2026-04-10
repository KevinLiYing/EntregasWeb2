import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	room: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Room',
		required: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	content: {
		type: String,
		required: true,
		trim: true,
		maxlength: 1000
	},
	readBy: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}]
}, {
	timestamps: true
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
