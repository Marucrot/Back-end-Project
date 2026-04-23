module.exports = (mongoose) => {
  const userSchema = new mongoose.Schema(
    {
      nama: {
        type: String,
        required: true,
        trim: true,
      },
      nomor_telp: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },
      nik: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
      },

      otp: {
        type: String,
        default: null,
      },
      otp_expired_at: {
        type: Date,
        default: null,
      },
      otp_purpose: {
        type: String,
        default: null,
      },

      pending_new_email: {
        type: String,
        default: null,
      },
      pending_new_phone: {
        type: String,
        default: null,
      },
      pending_new_password: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model('users', userSchema);
};
