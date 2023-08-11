const { Poll } = require('../../../db');
const mongoose = require('mongoose');

export default async function handler(req, res) {
    const id = req.query.id;

    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ message: 'Invalid poll ID', poll: null });

    const poll = await Poll.findOne({ _id: id });

    if (!poll)
        return res.status(404).json({ message: 'Poll not found', poll: null });

    res.status(200).json({ poll: poll });
}
