import bcrypt from "bcryptjs";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, //using this here so client will not be visible when retreiving so set to false
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

//TODO: need to create passwordconfirm field later
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete the password confirm field
  // this.passwordConfirm = undefined;

  next();
});

//TODO: need to add pre(save) for passwordChangedAt too below

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp; // changed password should be before the jwttimestamp  100<200
  }
  //if false password is not changed therefore the user is allowed to access the protected route
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  console.log({ resetToken: resetToken }, this.passwordResetToken);
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
