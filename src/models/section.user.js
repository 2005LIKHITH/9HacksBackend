import mongoose, { Schema } from 'mongoose';

// Defining the schema for a single time slot entry
const timeSlotSchema = new Schema({
    day: {
        type: String,
        required: true,  
    },
    time: {
        type: String,
        required: true,  
    },
    subject: {
        type: String,
        required: true, 
    },
    room: {
        type: String, 
    }
}, { _id: false });

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

const Section = mongoose.model('Section', sectionSchema);

export default Section;
