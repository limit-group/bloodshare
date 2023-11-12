const bcrypt = require("bcryptjs");
const { jwtSign } = require("../middlewares/auth.middleware");
const { generateOTP } = require("../services/otp.service");
const { sendSMS } = require("../services/message.service");
const supabase = require("../utils/db.utils");

exports.endpoint = (req, res) => {
  res.json({
    message: "Endpoint is up!",
  });
};

const generatePassword = (password) => {
  encrypted = bcrypt.hashSync(password, 10);
  return encrypted;
};

exports.mobileSignup = async (req, res) => {
  const { password, phone, role } = req.body;
  const otp = generateOTP();
  const { data: user, userError } = await supabase
    .from("users")
    .select("*")
    .eq("phoneNumber", phone);
  if (userError)
    return res
      .status(500)
      .send({ message: "Failed to SignUp!" });
  if (user.length > 0)
    return res
      .status(400)
      .send({ message: "User with this phone number exists!" });
  const { data: new_user, newUserError } = await supabase.from("users").insert([
    {
      phoneNumber: phone,
      password: generatePassword(password),
      otp: otp,
      role: role,
    },
  ]);
  if (newUserError)
    return res
      .status(500)
      .send({ message: "Unable to signup, please try again later!" });
  await sendSMS({
    to: phone,
    message: `Enter this code ${otp} to verify your account . Thank you.`,
  });
  res.status(201).send({
    message: "User Created.",
  });
};

exports.mobileLogin = async (req, res) => {
  const { phone, password } = req.body;
  const { data: user, userError } = await supabase
    .from("users")
    .select("*")
    .eq("phoneNumber", phone);
  if (userError) return res.status(500).send({ message: "Login Failed!" });
  if (user.length ==  0)
    return res
      .status(400)
      .json({ message: "user with this mobile doesn't exist" });

  if (user && bcrypt.compareSync(password, user[0].password)) {
    return res.status(200).send({
      token: jwtSign(user[0]),
      role: user.role,
      message: "authentication success",
    });
  } else {
    return res.status(401).send({ message: "Wrong Password provided." });
  }
};

exports.verifyPhone = async (req, res) => {
  const { code, phone } = req.body;
  const { data: user, userError } = await supabase
    .from("users")
    .select("*")
    .eq("phoneNumber", phone);
  if (userError)
    return res.status(500).send({ message: "Verification Failed!" });
  if (user && user[0].otp == code) {
    const { data, newError } = await supabase
      .from("users")
      .update({ verified: true })
      .eq("phoneNumber", phone);
    if (newError)
      return res.status(500).send({ message: "Phone verification failed!" });
    res.status(200).send({ message: "User verification success" });
  } else {
    res.status(500).send({ message: "An Invalid Code supplied!" });
  }
};

exports.updatePassword = async (req, res) => {
  encrypted = generatePassword(req.body.password);
  const { data, error } = await supabase
    .from("users")
    .update({ password: encrypted })
    .eq("id", req.user.id);
  if (error) res.status(500).send({ message: "password update failure" });
  res.status(200).send({ message: "password change successful" });
};

exports.forgotPassword = async (req, res) => {
  const { data, userError } = await supabase
    .from("users")
    .select("*")
    .eq("phoneNumber", phone);
  if (userError)
    return res
      .status(500)
      .send({ message: "User with this phone number not found!" });
  res.status(200).send({ message: "User Found." });
};

exports.resendOTP = async (req, res) => {
  const otp = generateOTP();
  await sendSMS({
    to: req.body.phone,
    message: `Enter this code ${otp} to recover your account .Thank you.`,
  });
  const { data, error } = await supabase
    .from("users")
    .update({ otp: otp })
    .eq("phoneNumber", phone);
  if (error)
    return res
      .status(500)
      .send({ message: "User with this phone number not found!" });
  res.status(200).send({ message: "Check SMS for OTP code." });
};

exports.getUserProfile = async (req, res) => {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("userId", req.user.id);
  if (error)
    return res.status(404).send({
      message: "profile requested not found!",
    });
  res.status(200).send(profile[0]);
};

exports.addUserProfile = async (req, res) => {
  const {
    fullName,
    dob,
    bloodType,
    latitude,
    longitude,
    bodyWeight,
    email,
    gender,
  } = req.body;
  const image_url = req.file.filename;
  if (!image_url) {
    return res.status(500).send({ message: "failed to upload your avatar." });
  }
  const { data, error } = await supabase.from("profiles").insert([
    {
      userId: req.user.id,
      name: fullName,
      bloodType: bloodType,
      gender: gender,
      avatar: image_url,
      email: email,
      bodyWeight: bodyWeight,
      dateOfBirth: dob,
      // latitude: latitude.toString(),
      // longitude: longitude.toString(),
    },
  ]);
  if (error)
    return res.status(500).send({
      message: "user profile creation failure",
    });
  res.status(201).send({
    message: "profile created Success",
  });
};

exports.updateUserProfile = async (req, res) => {
  const { fullName, image, email, dob } = req.body;
  const { data, error } = await supabase
    .from("profiles")
    .update({
      name: fullName,
      email: email,
      dateOfBirth: dob,
    })
    .eq("userId", req.user.id);
  if (error)
    res.status(500).send({
      message: "user profile failure",
    });
  res.status(200).send({ message: "profile updated" });
};

exports.getUsers = async (req, res) => {
  const { data: users, error } = await supabase.from("users").select("*");
  if (error) res.status(500).send("failed to get users");
  res.status(200).send(users);
};

exports.createUser = async (req, res) => {
  const { phone, role, password } = req.body;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("phoneNumber", phone);
  if (error)
    return res.status(500).send({
      message: "unable to create user, please try again later",
    });
  if (!data) return res.send("user with this phone number exists");
  encrypted = generatePassword(password);
  const { data: user, userError } = await supabase
    .from("users")
    .insert([{ phoneNumber: phone, password: encrypted, role: role }]);
  if (userError || !user)
    return res.status(500).send({
      message: "unable to create user, please try again later",
    });
  res.status(200).send({
    message: "user account creation success",
  });
};

exports.addFacilityProfile = async (req, res) => {
  const {
    phone,
    fname,
    email,
    latitude,
    longitude,
    city,
    country,
    mission,
    licenseNumber,
  } = req.body;
  const { data: facility, error } = await supabase
    .from("facilities")
    .insert([
      {
        name: fname,
        email: email,
        latitude: latitude,
        longitude: longitude,
        city: city,
        country: country,
        mission: mission,
        license: req.file.filename,
        licenseNumber: licenseNumber,
      },
    ])
    .select();
  if (error)
    return res.status(500).send({
      message: "failed to add Facility profile",
    });
  const { data: user, userError } = await supabase.from("users").update({
    facilityId: facility[0].id,
  });
  if (userError)
    return res.status(500).send({
      message: "failed to add Facility profile",
    });
  res.status(201).send({
    message: "facility added success",
  });
};

exports.getFacilityProfile = async (req, res) => {
  const { data: facility, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.user.id);
  if (error)
    return res.status(500).send({
      message: "failed to fetch facility profile!",
    });
  const { data: profile, profileError } = await supabase
    .from("facilities")
    .select("*")
    .eq("id", facility[0].facilityId);
  if (profileError)
    return res.status(500).send({
      message: "failed to fetch facility profile!",
    });
  res.status(200).send(profile);
};
