const { User, Poll } = require('../../../db');

export default async function handler(req, res) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token)
        return res.status(401).json({ error: 'Missing token' });

    const user = await User.findOne({ 'session.token': token });

    if (!user)
        return res.status(401).json({ error: 'Invalid token' });

    const { title, questions } = req.body;

    if (!title || !questions) {
        res.status(400).json({ error: 'Missing title or questions' });
        return;
    }

    const canUpdateVote = req.body.canUpdateVote ?? false;
    const multiSelect = req.body.multiSelect ?? false;

    const poll = await Poll.create({
        title: title,
        canUpdateVote: canUpdateVote,
        multiSelect: multiSelect,
        questions: questions.map(question => {
            return {
                question: question.question,
                canUpdateVote: question.canUpdateVote ?? canUpdateVote,
                multiSelect: question.multiSelect ?? multiSelect,
                options: question.options.map(option => {
                    return {
                        title: option.title,
                        description: option.description,
                        votes: []
                    }
                }),
                votes: [],
            };
        })
    });

    user.polls.push(poll._id);
    await user.save();

    res.status(200).json({ poll: poll });
}
