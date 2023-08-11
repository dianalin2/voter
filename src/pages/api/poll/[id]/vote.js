const { User, Poll } = require('../../../../db');
const mongoose = require('mongoose');

export default async function handler(req, res) {
    const id = req.query.id;

    if (!mongoose.isValidObjectId(id))
        return res.status(400).json({ message: 'Invalid poll ID', poll: null });

    const formRes = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    const user = await User.findOne({ 'session.token': token });

    if (!user)
        return res.status(401).json({ error: 'Invalid token' });

    const poll = await Poll.findOne({ _id: id }).populate('questions.votes');

    if (!poll)
        return res.status(404).json({ message: 'Poll not found', poll: null });

    poll.questions.forEach(question => {
        if (!formRes[question._id])
            return;

        if (!question.multiSelect && formRes[question._id].options.length > 1)
            return;

        const vote = question.votes.find(vote => vote.user.equals(user._id));
        if (vote) {
            if (question.canUpdateVote)
                vote.options = formRes[question._id].options;
        } else {
            question.votes.push({
                user: user,
                options: formRes[question._id].options
            });
        }
    });

    await poll.save();

    res.status(200).json({
        poll: {
            _id: poll._id,
            title: poll.title,
            canUpdateVote: poll.canUpdateVote,
            questions: poll.questions.map(question => {
                const vote = question.votes.find(vote => vote.user.equals(user._id));
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
