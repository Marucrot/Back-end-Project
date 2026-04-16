const bcrypt = require('bcrypt');
const userRepo = require('./userRepo');

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function isOtpExpired(expiredAt) {
  return !expiredAt || new Date() > new Date(expiredAt);
}

async function register(payload) {
  const { nama, nomor_telp, email, nik, password, confirm_password } = payload;

  if (!nama || !nomor_telp || !email || !nik || !password || !confirm_password) {
    throw new Error('Semua field wajib diisi');
  }

  if (password !== confirm_password) {
    throw new Error('Konfirmasi password tidak sama');
  }

  const existingEmail = await userRepo.findByEmail(email);
  if (existingEmail) {
    throw new Error('Email sudah terdaftar');
  }

  const existingPhone = await userRepo.findByPhone(nomor_telp);
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
    nomor_telp,
    email: email.toLowerCase(),
    nik,
    password: hashedPassword,
  });

  return {
    message: 'Register berhasil',
    data: {
      id: user._id,
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
      id: user._id,
      nama: user.nama,
      nomor_telp: user.nomor_telp,
      email: user.email,
      nik: user.nik,
    },
  };
}

async function requestChangePassword(payload) {
  const { email, old_password, new_password, confirm_new_password } = payload;

  if (!email || !old_password || !new_password || !confirm_new_password) {
    throw new Error('Semua field wajib diisi');
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new Error('User tidak ditemukan');
  }

  module.exports = {
    register,
    login,
    requestChangePassword,
  };
}
