import mongoose from "mongoose";

const { Schema } = mongoose;

const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    adminId: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const teamModel = mongoose.model('Team', teamSchema);

export { teamModel };