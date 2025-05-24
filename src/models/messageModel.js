import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    teamId: {
        type: Schema.Types.ObjectId,
        ref: 'Team',
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
}, {
    timestamps: false
});


const messageModel = mongoose.model('Message', messageSchema);

export { messageModel };