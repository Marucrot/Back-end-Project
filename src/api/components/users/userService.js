const bcrypt = require('bcrypt');
const userRepo = require('./userRepo');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isOtpExpired(expiredAt) {
  return !expiredAt || new Date() > new Date(expiredAt);
}

async function register(payload) {
  const {
    nama,
    nomor_telp: nomorTelp,
    email,
    nik,
    password,
    confirm_password: confirmPassword,
  } = payload;

  if (!nama || !nomorTelp || !email || !nik || !password || !confirmPassword) {
    throw new Error('Semua field wajib diisi');
  }

  if (password !== confirmPassword) {
    throw new Error('Konfirmasi password tidak sama');
  }

  const existingEmail = await userRepo.findByEmail(email);
  if (existingEmail) {
    throw new Error('Email sudah terdaftar');
  }

  const existingPhone = await userRepo.findByPhone(nomorTelp);
  if (existingPhone) {
    throw new Error('Nomor telepon sudah terdaftar');
  }

  const existingNik = await userRepo.findByNik(nik);
  if (existingNik) {
    throw new Error('NIK sudah terdaftar');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepo.createUser({
    nama,
    nomor_telp: nomorTelp,
    email: email.toLowerCase(),
    nik,
    password: hashedPassword,
  });

  return {
    message: 'Register berhasil',
    data: {
      id: user.id,
      nama: user.nama,
      nomor_telp: user.nomor_telp,
      email: user.email,
      nik: user.nik,
    },
  };
}

async function login(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error('Email dan password wajib diisi');
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('Email atau password salah');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Email atau password salah');
  }

  return {
    message: 'Login berhasil',
    data: {
      id: user.id,
      nama: user.nama,
      nomor_telp: user.nomor_telp,
      email: user.email,
      nik: user.nik,
    },
  };
}

async function requestChangePassword(payload) {
  const {
    email,
    old_password: oldPassword,
    new_password: newPassword,
    confirm_new_password: confirmNewPassword,
  } = payload;

  if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
    throw new Error('Semua field wajib diisi');
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new Error('Password lama salah');
  }

  if (newPassword !== confirmNewPassword) {
    throw new Error('Konfirmasi password baru tidak sama');
  }

  const sameAsOld = await bcrypt.compare(newPassword, user.password);
  if (sameAsOld) {
    throw new Error('Password baru tidak boleh sama dengan password lama');
  }

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  const otp = generateOtp();
  const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

  await userRepo.updateUserById(user.id, {
    otp,
    otp_expired_at: expiredAt,
    otp_purpose: 'change_password',
    pending_new_password: hashedNewPassword,
  });

  return {
    message: 'OTP untuk ganti password berhasil dibuat',
    otp_debug: otp,
  };
}

async function changePassword(payload) {
  const { email, otp } = payload;

  if (!email || !otp) {
    throw new Error('Email dan OTP wajib diisi');
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  if (user.otp_purpose !== 'change_password') {
    throw new Error('OTP tidak valid untuk ganti password');
  }

  if (user.otp !== otp) {
    throw new Error('OTP salah');
  }

  if (isOtpExpired(user.otp_expired_at)) {
    throw new Error('OTP sudah kadaluarsa');
  }

  await userRepo.updateUserById(user.id, {
    password: user.pending_new_password,
    otp: null,
    otp_expired_at: null,
    otp_purpose: null,
    pending_new_password: null,
  });

  return {
    message: 'Password berhasil diganti',
  };
}

async function requestChangeEmail(payload) {
  const { old_email: oldEmail, new_email: newEmail } = payload;

  if (!oldEmail || !newEmail) {
    throw new Error('Email lama dan email baru wajib diisi');
  }

  const user = await userRepo.findByEmail(oldEmail);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  const existingNewEmail = await userRepo.findByEmail(newEmail);
  if (existingNewEmail) {
    throw new Error('Email baru sudah dipakai');
  }

  const otp = generateOtp();
  const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

  await userRepo.updateUserById(user.id, {
    otp,
    otp_expired_at: expiredAt,
    otp_purpose: 'change_email',
    pending_new_email: newEmail.toLowerCase(),
  });

  return {
    message: 'OTP untuk ganti email berhasil dibuat',
    otp_debug: otp,
  };
}

async function changeEmail(payload) {
  const { old_email: oldEmail, new_email: newEmail, otp } = payload;

  if (!oldEmail || !newEmail || !otp) {
    throw new Error('Semua field wajib diisi');
  }

  const user = await userRepo.findByEmail(oldEmail);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  if (user.otp_purpose !== 'change_email') {
    throw new Error('OTP tidak valid untuk ganti email');
  }

  if (user.otp !== otp) {
    throw new Error('OTP salah');
  }

  if (isOtpExpired(user.otp_expired_at)) {
    throw new Error('OTP sudah kadaluarsa');
  }

  if (user.pending_new_email !== newEmail.toLowerCase()) {
    throw new Error('Email baru tidak cocok dengan request sebelumnya');
  }

  await userRepo.updateUserById(user.id, {
    email: user.pending_new_email,
    otp: null,
    otp_expired_at: null,
    otp_purpose: null,
    pending_new_email: null,
  });

  return {
    message: 'Email berhasil diganti',
  };
}

async function requestChangePhone(payload) {
  const { email, old_phone: oldPhone, new_phone: newPhone } = payload;

  if (!email || !oldPhone || !newPhone) {
    throw new Error('Semua field wajib diisi');
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  if (user.nomor_telp !== oldPhone) {
    throw new Error('Nomor telepon lama tidak cocok');
  }

  const existingPhone = await userRepo.findByPhone(newPhone);
  if (existingPhone) {
    throw new Error('Nomor telepon baru sudah dipakai');
  }

  const otp = generateOtp();
  const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

  await userRepo.updateUserById(user.id, {
    otp,
    otp_expired_at: expiredAt,
    otp_purpose: 'change_phone',
    pending_new_phone: newPhone,
  });

  return {
    message: 'OTP untuk ganti nomor telepon berhasil dibuat',
    otp_debug: otp,
  };
}

async function changePhone(payload) {
  const { email, old_phone: oldPhone, new_phone: newPhone, otp } = payload;

  if (!email || !oldPhone || !newPhone || !otp) {
    throw new Error('Semua field wajib diisi');
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  if (user.nomor_telp !== oldPhone) {
    throw new Error('Nomor telepon lama tidak cocok');
  }

  if (user.otp_purpose !== 'change_phone') {
    throw new Error('OTP tidak valid untuk ganti nomor telepon');
  }

  if (user.otp !== otp) {
    throw new Error('OTP salah');
  }

  if (isOtpExpired(user.otp_expired_at)) {
    throw new Error('OTP sudah kadaluarsa');
  }

  if (user.pending_new_phone !== newPhone) {
    throw new Error('Nomor telepon baru tidak cocok dengan request sebelumnya');
  }

  await userRepo.updateUserById(user.id, {
    nomor_telp: user.pending_new_phone,
    otp: null,
    otp_expired_at: null,
    otp_purpose: null,
    pending_new_phone: null,
  });

  return {
    message: 'Nomor telepon berhasil diganti',
  };
}

async function requestDeleteAccount(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new Error('Email dan password wajib diisi');
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Password salah');
  }

  const otp = generateOtp();
  const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

  await userRepo.updateUserById(user.id, {
    otp,
    otp_expired_at: expiredAt,
    otp_purpose: 'delete_account',
  });

  return {
    message: 'OTP untuk hapus akun berhasil dibuat',
    otp_debug: otp,
  };
}

async function deleteAccount(payload) {
  const { email, otp } = payload;

  if (!email || !otp) {
    throw new Error('Email dan OTP wajib diisi');
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  if (user.otp_purpose !== 'delete_account') {
    throw new Error('OTP tidak valid untuk hapus akun');
  }

  if (user.otp !== otp) {
    throw new Error('OTP salah');
  }

  if (isOtpExpired(user.otp_expired_at)) {
    throw new Error('OTP sudah kadaluarsa');
  }

  await userRepo.deleteUserById(user.id);

  return {
    message: 'Akun berhasil dihapus',
  };
}

module.exports = {
  register,
  login,
  requestChangePassword,
  changePassword,
  requestChangeEmail,
  changeEmail,
  requestChangePhone,
  changePhone,
  requestDeleteAccount,
  deleteAccount,
};
