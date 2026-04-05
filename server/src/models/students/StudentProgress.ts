import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IStudentProgress extends Document {
    profileId: mongoose.Types.ObjectId
    hoursCompleted: number
    certificates: {
        title: string
        issuedAt: Date
        issuer?: string
    }[]
    createdAt: Date
    updatedAt: Date
}

const StudentProgressSchema = new Schema<IStudentProgress>(
    {
        profileId: {
            type: Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
            unique: true,   // one progress doc per student
            index: true,
        },
        hoursCompleted: {
            type: Number,
            default: 0,
            min: 0,
        },
        certificates: [
            {
                title: { type: String, required: true },
                issuedAt: { type: Date, default: Date.now },
                issuer: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
)

const StudentProgress: Model<IStudentProgress> =
    mongoose.models.StudentProgress ??
    mongoose.model<IStudentProgress>('StudentProgress', StudentProgressSchema)

export default StudentProgress