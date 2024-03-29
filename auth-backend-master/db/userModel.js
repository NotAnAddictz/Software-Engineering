const mongoose = require("mongoose");

// user schema
const UserSchema = new mongoose.Schema({
  // email field
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },

  //   password field
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
  usertype: {
    type: String,
    required: [true, "Please provide a user type!"],
    unique: false,
  },
  favourites: [{
    origin: String, destination: String
    }],
  otp:{
    type: Number,
    unique: false,
  },
  verified:{
    type:Boolean,
    unique: false,
  }
});

// export UserSchema
module.exports = mongoose.model.Users || mongoose.model("Users", UserSchema);
