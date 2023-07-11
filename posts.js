// routes logic
import mongoose from 'mongoose';

import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
	try {
		const postMessages = await PostMessage.find();

		res.status(200).json(postMessages);
	} catch (err) {
		res.status(404).json({ message: err.message });
	}
};

export const createPost = async (req, res) => {
	const post = req.body;

	const newPost = new PostMessage({ ...post, author: req.userId, createdAt: new Date().toISOString() });

	try {
		await newPost.save();

		res.status(200).json(newPost);
	} catch (err) {
		res.status(409).json({ message: err.message });
	}
};

export const updatePost = async (req, res) => {
	const { id } = req.params;
	const { title, message, author, selectedFile, tags } = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

	const updatedPost = { author, title, message, tags, selectedFile, _id: id };

	await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

	res.json(updatedPost);
};

export const deletePost = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

	await PostMessage.findByIdAndRemove(id);

	res.json({ message: 'Post deleted successfully' });
};
