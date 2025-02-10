import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Course name is required"],
      unique: true,
      maxLength: [30, "Name cannot exceed 30 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxLength: [150, "Description cannot exceed 150 characters"],
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A teacher is required for the course"],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true, 
  }
);

export default mongoose.model("Course", courseSchema);
