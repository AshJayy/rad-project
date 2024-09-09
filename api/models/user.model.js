import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userLevel: {
      type: Number,
      required: true,
      default: 0,
      // 0: normal user
      // 1: admin
      // 2: super admin
    },
    profilePicture: {
      type: String,
      default: "https://isobarscience-1bfd8.kxcdn.com/wp-content/uploads/2020/09/default-profile-picture1.jpg",
    },
    name: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    currentPlan: {
      type: Number,
      required: true,
      enum: [-1,0,1,2],
      default: -1,
      // -1: unsubscribe
      // 0: weekly
      // 1: monthly
      // 2: annuall
    },

  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;