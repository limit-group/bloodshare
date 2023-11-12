const supabase = require("../utils/db.utils");
const { v4: uuidv4 } = require("uuid");

exports.allDonations = async (req, res) => {
  const { data: donations, error } = await supabase
    .from("donations")
    .select("*");
  if (error)
    return res.status(500).send({ message: "Failed to get donations" });
  res.status(200).send(donations);
};

exports.myDonations = async (req, res) => {
  const userId = req.user.id;
  const { data: donations, error } = await supabase.from("donations").select(
    `*, profiles {
       ${userId}
     }`
  );
  if (error)
    return res.status(404).send({ message: "You have not made any donations" });
  res.status(200).send(donations);
};

exports.donated = async (req, res) => {
  const { donor_number, facility, date } = req.body;
  const { error } = await supabase
    .from("donations")
    .insert([
      {
        profileId: req.user.id,
        donorNumber: donor_number,
        facility: facility,
        donationDate: date,
      },
    ])
    .select();
  if (error)
    return res.status(500).send({ message: "Failed to record donation." });
  const { data, profileError } = await supabase
    .from("profiles")
    .update({ bloodPoints: 10 })
    .eq("userId", req.user.id);
  if (profileError)
    return res.status(500).send({ message: "Failed to record donation." });
  res.status(201).send({ message: "Donation Saved." });
};

exports.createRecord = async (req, res) => {
  const {
    name,
    bodyWeight,
    bloodType,
    donationDate,
    phoneNumber,
    dateOfBirth,
    gender,
    bloodUnit,
  } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("facilityId")
    .eq("id", req.user.id);
  const { recordData, recordError } = await supabase
    .from("records")
    .insert([
      {
        name: name,
        phoneNumber: phoneNumber,
        dateOfBirth: new Date(dateOfBirth),
        bloodType: bloodType,
        bodyWeight: bodyWeight,
        donationDate: donationDate,
        donationId: uuidv4().replace(/-/g, "").substring(0, 7),
        bloodUnits: parseInt(bloodUnit),
        gender: gender,
        facilityId: data,
      },
    ])
    .select();
  res.status(201).send({
    donationId: recordData.donationId,
  });
  if (error || recordError)
    res.status(500).send({
      message: "failed to add record",
    });
};

exports.getRecords = async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("facilityId")
    .eq("id", req.user.id);
  const { data: records, recordsError } = await supabase
    .from("records")
    .select("*")
    .eq("facilityId", data);
  if (error || recordsError)
    res.status(500).send({
      message: "failed to fetch records",
    });
  res.status(200).send(records);
};

exports.getAllRecords = async (req, res) => {
  const { data: records, error } = await supabase.from("records").select("*");
  if (error)
    return res.status(500).send({
      message: "failed to fetch records",
    });
  res.status(200).send(records);
};
