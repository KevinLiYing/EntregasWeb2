import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 2,
		maxlength: 50
	},
	description: {
		type: String,
		maxlength: 200
	},
	users: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}],
	isPrivate: {
		type: Boolean,
		default: false
	}
}, {
	timestamps: true
});

const Room = mongoose.model('Room', roomSchema);
export default Room;
