import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createError } from '../error.js';
import UserModal from '../models/user.js';

export const signup = async (req, res, next) => {
	const { email, password, firstName, lastName } = req.body;

	try {
		const existingUser = await UserModal.findOne({ email });
		if (existingUser) return res.status(400).json({ message: 'User already exists' });

		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(password, salt);

		const newUser = new UserModal({
			...req.body,
			password: hashedPassword,
			name: `${firstName} ${lastName}`,
			email: email,
		});
		const token = jwt.sign({ email: newUser.email, id: newUser._id }, process.env.JWT_KEY, {
			expiresIn: '1h',
		});

		await newUser.save();
		res.status(200).json({ userInfo: newUser, token });
	} catch (error) {
		next(error);
	}
};

export const signin = async (req, res, next) => {
	try {
		const user = await UserModal.findOne({ email: req.body.email });
		if (!user) return next(createError(404, 'User not found!'));

		const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

		if (!isPasswordCorrect) return next(createError(400, 'Invalid credentials!'));

		const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, { expiresIn: '1h' });
		const { password, ...userInfo } = user._doc;

		res.status(200).json({ userInfo, token });
	} catch (err) {
		next(err);
	}
};
