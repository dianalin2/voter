const { Poll, User } = require('../../../db');
const mongoose = require('mongoose');

export default async function handler(req, res) {
    const id = req.query.id;

    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ message: 'Invalid poll ID', poll: null });

    const poll = await Poll.findOne({ _id: id });

    if (!poll)
        return res.status(404).json({ message: 'Poll not found', poll: null });

    const token = req.headers.authorization?.split(' ')[1];
    const user = await User.findOne({ 'session.token': token });

    res.status(200).json({
        poll: {
            _id: poll._id,
            title: poll.title,
            canUpdateVote: poll.canUpdateVote,
            questions: poll.questions.map(question => {
                const vote = user ? question.votes.find(vote => vote.user.equals(user._id)) : null;
                return {
                    _id: question._id,
                    question: question.question,
                    canUpdateVote: question.canUpdateVote,
                    multiSelect: question.multiSelect,
                    options: question.options,
                    votes: vote ? [{
                        user: vote.user._id,
                        options: vote.options
                    }] : []
                }
            })
        }
    });
}
