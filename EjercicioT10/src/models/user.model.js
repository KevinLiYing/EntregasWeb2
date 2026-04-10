import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		minlength: 2,
		maxlength: 50
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
		match: /.+@.+\..+/
	},
	password: {
		type: String,
		required: true,
		minlength: 6,
		select: false // No devolver por defecto
	},
	online: {
		type: Boolean,
		default: false
	},
	avatar: {
		type: String
	}
}, {
	timestamps: true
});

// Hashear contraseña antes de guardar
userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

// Método para comparar contraseña
userSchema.methods.comparePassword = function(candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

// Ocultar password y __v al serializar
userSchema.methods.toJSON = function() {
	const obj = this.toObject();
	delete obj.password;
	delete obj.__v;
	return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
