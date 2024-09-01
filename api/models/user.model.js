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
    }, { timestamps: true }
)

const User = mongoose.model('User', userSchema);

export default User;