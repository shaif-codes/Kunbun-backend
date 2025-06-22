import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    order: {
        type: Number
    }
}, {
    timestamps: true
});

const projectStatusSectionSchema = new Schema({
    status: {
        type: String
    },
    tasks: {
        type: [taskSchema],
        default: []
    }
});

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    members: {
        type: [Types.ObjectId],
        ref: 'User',
        required: true
    },
    statusSection: {
        type: [projectStatusSectionSchema],
        default: [
            { status: 'todo', tasks: [] },
            { status: 'in-progress', tasks: [] },
            { status: 'done', tasks: [] }
        ]
    }
}, {
    timestamps: true
});

const projectModel = mongoose.model('Project', projectSchema);

export { projectModel };