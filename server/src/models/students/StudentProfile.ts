import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IStudentProfile extends Document {
    name: string
    age: number
    school?: string
    language: string
    experience: 'none' | 'once' | 'some' | 'regular'
    hoursPerYear?: number
    createdAt: Date
    updatedAt: Date
    clerkId: {
        type: String,
        required: true,
        unique: true,  
        index: true,
    },
}

const StudentProfileSchema = new Schema<IStudentProfile>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        age: {
            type: Number,
            required: true,
            min: 13,
            max: 19,
        },
        school: {
            type: String,
            trim: true,
        },
        language: {
            type: String,
            default: 'English',
            enum: ['English', 'French', 'Mandarin', 'Cantonese', 'Punjabi', 'Spanish', 'Other'],
        },
        experience: {
            type: String,
            enum: ['none', 'once', 'some', 'regular'],
            default: 'none',
        },
        hoursPerYear: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
)

// No indexes needed — this collection is only ever fetched by _id for dashboard display


const StudentProfile: Model<IStudentProfile> =
    mongoose.models.StudentProfile ??
    mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema)

export default StudentProfile

