import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IStudentQuiz extends Document {
    // Reference back to the profile (for joining on dashboard)
    profileId: mongoose.Types.ObjectId

    // Single-select answers
    goal: 'hours' | 'resume' | 'skills' | 'community'
    energy: 'chill' | 'moderate' | 'fast-paced'
    social: 'solo' | 'small' | 'big'
    task: 'people' | 'creative' | 'background' | 'physical'
    onboarding: 'jump-in' | 'light' | 'structured' | 'depends'

    // Multi-select answers — stored as arrays, indexed for matching queries
    cause: string[]
    skills: string[]
    availability: string[]

    completedAt: Date
    createdAt: Date
    updatedAt: Date
}

const StudentQuizSchema = new Schema<IStudentQuiz>(
    {
        profileId: {
            type: Schema.Types.ObjectId,
            ref: 'StudentProfile',
            required: true,
        },

        // Single-select — indexed individually since matching filters on these
        goal: {
            type: String,
            required: true,
            enum: ['hours', 'resume', 'skills', 'community'],
            index: true,
        },
        energy: {
            type: String,
            required: true,
            enum: ['chill', 'moderate', 'fast-paced'],
            index: true,
        },
        social: {
            type: String,
            required: true,
            enum: ['solo', 'small', 'big'],
            index: true,
        },
        task: {
            type: String,
            required: true,
            enum: ['people', 'creative', 'background', 'physical'],
            index: true,
        },
        onboarding: {
            type: String,
            required: true,
            enum: ['jump-in', 'light', 'structured', 'depends'],
            index: true,
        },

        // Multi-select arrays — each needs its own index for $in/$all queries
        cause: {
            type: [String],
            required: true,
            index: true,
        },
        skills: {
            type: [String],
            required: true,
            index: true,
        },
        availability: {
            type: [String],
            required: true,
            index: true,
        },

        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

// ── Compound index for the core matching query ─────────────────────────────
// Most match queries will filter on cause + availability + task together,
// so a compound index on these three is more efficient than three separate ones

// ── Compound index for org-side filtering ─────────────────────────────────
// Orgs may filter by energy + onboarding to find students who suit their pace
StudentQuizSchema.index({ energy: 1, onboarding: 1 })

const StudentQuiz: Model<IStudentQuiz> =
    mongoose.models.StudentQuiz ??
    mongoose.model<IStudentQuiz>('StudentQuiz', StudentQuizSchema)

export default StudentQuiz