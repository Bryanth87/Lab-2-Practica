import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      maxLength: [25, "Name cannot exceed 25 characters"],
    },
    surname: {
      type: String,
      required: [true, "Surname is required"],
      maxLength: [25, "Surname cannot exceed 25 characters"],
    },
    userName: {
      type: String,
      required: [true, "User name is required"],
      unique: true,
    },
    email: {s
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      required: true,
      enum: ["STUDENT_ROLE", "TEACHER_ROLE"], default: "STUDENT_ROLE"
    },
    courses: [{  
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course",
    default: []
    }],
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false, 
    timestamps: true, 
  }
);

userSchema.methods.toJSON = function () {
  const { __v, password, _id, ...usuario } = this.toObject();
  usuario.uid = _id; 
  return usuario;
};

export default model("User", userSchema);