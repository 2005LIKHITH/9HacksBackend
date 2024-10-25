import mongoose, { Schema } from 'mongoose';

// Defining the schema for a single time slot entry
const timeSlotSchema = new Schema({

    time: {
        type: String,
        required: true,  
    },
    subject: {
        type: String,
        required: true, 
    }
});

const sectionSchema = new Schema({
    section: {
        type: String,
        required: true,
        index: true  // e.g., "R", "S"
    },
    timeTables: {
        Monday: [timeSlotSchema],
        Tuesday: [timeSlotSchema],
        Wednesday: [timeSlotSchema],
        Thursday: [timeSlotSchema],
        Friday: [timeSlotSchema],
        Saturday: [timeSlotSchema],
        Sunday: [timeSlotSchema]  
    }
});

export const Section = mongoose.model('Section', sectionSchema);

