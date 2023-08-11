const mongoose = require('mongoose');
const uuid = require('uuid');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const sessionSchema = new mongoose.Schema({
    token: {
        type: String,
        default: () => uuid.v4()
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    valid: {
        type: Boolean,
        default: true
    }
});

const userSchema = new mongoose.Schema({
    discordId: String,
    discordToken: Object,
    sessionId: String,
    polls: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Poll'
    }],
    session: sessionSchema
});

userSchema.methods.generateSessionToken = async function () {
    this.session = {
        user: this._id
    };

    await this.save();

    return this.session;
};

userSchema.methods.validateSessionToken = function (token) {
    if (!this.session || !this.session.token || !this.session.expiresAt || !this.session.valid)
        return null;

    if (this.session.token !== token)
        return null;

    if (this.session.expiresAt < new Date())
        return null;

    return this;
};

const optionSchema = new mongoose.Schema({
    title: String,
    description: String,
});

const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    options: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
    }]
});

const questionSchema = new mongoose.Schema({
    question: String,
    canUpdateVote: Boolean,
    multiSelect: Boolean,
    options: [optionSchema],
    votes: [voteSchema]
});

const pollSchema = new mongoose.Schema({
    title: String,
    canUpdateVote: Boolean,
    questions: [questionSchema]
});

const Poll = mongoose.models.Poll ?? mongoose.model('Poll', pollSchema);
const User = mongoose.models.User ?? mongoose.model('User', userSchema);

module.exports = {
    Poll,
    User
};
