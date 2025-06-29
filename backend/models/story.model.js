import mongoose from "mongoose";

// const storySchema = new mongoose.Schema({
//     user:{type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
//     mediaUrl:{type:String},
//     mediaType:{type:String, enum:['image','video']},
// },{timestamps:true})

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 } // Expires in 24 hours
}, { timestamps: true });


export const Story = mongoose.model('Story',storySchema)