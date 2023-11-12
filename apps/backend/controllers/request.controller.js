const { sendAlert, confirmAcceptance } = require("../services/message.service");
const supabase = require("../utils/db.utils");

exports.requestByMe = async (req, res) => {
  const { data: requests, error } = await supabase
    .from("requests")
    .select("*")
    .eq("userId", re.user.id);
  if (error) res.status(500).send({ message: "Something went wrong!" });
  res.status(200).send(requests);
};

exports.getRequest = async (req, res) => {
  const { data: requests, error } = await supabase.from("requests").select("*");
  if (error) res.status(500).send({ message: "Something went wrong!" });
  const new_b = [];
  requests.forEach((element) => {
    if (element.accept < 3) {
      new_b.push(element);
    }
  });
  res.status(200).send(new_b);
};

exports.getLatestRequest = async (req, res) => {
  const { data: donations, donationError } = await supabase
    .from("donations")
    .select("*");
  const { data: requests, error } = await supabase.from("requests").select("*");
  const new_b = [];
  requests.forEach((element) => {
    if (element.accept < 3) {
      new_b.push(element);
    }
  });
  if (error || donationError)
    res.status(500).send({ message: "Something went wrong!" });
  res.status(200).send({
    requests: new_b,
    request_count: requests.length,
    donations_count: donations.length,
  });
};

exports.createRequest = async (req, res) => {
  const userId = req.user.id;
  let {
    bloodGroup,
    requestType,
    when,
    needed,
    patientName,
    relationship,
    diagnosis,
    biography,
    latitude,
    longitude,
  } = req.body;
  if (requestType == "SELF") {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("userId", userId);
    let patientName = data[0].name || "test";
    if (error)
      return res.status(500).send({
        message: "Could not send blood request!",
      });
    return patientName;
  }
  const { data: profiles, error } = await supabase.from("profiles")
    .select(`*, users (
    userId
  )`);
  if (error)
    return res.status(500).send({
      message: "Could not send blood request!",
    });
  let recipients = [];
  profiles.map((prof) => {
    recipients.push(prof["user"]["phoneNumber"]);
  });
  //send the alert messages.
  if (profiles.length > 0) {
    const info = await sendAlert({ to: recipients, name: req.user.name });
    if (info) {
      console.log("sms sent.");
    } else {
      console.log("sending sms failed.");
    }
  }
  const { data: request, reqError } = await supabase.from("requests").insert([
    {
      userId: req.user.id,
      bloodGroup: bloodGroup,
      requestType: requestType,
      date: when,
      diagnosis: diagnosis,
      biography: biography,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      bloodUnits: parseInt(needed),
      patientName: patientName,
      relationship: relationship,
    },
  ]);
  if (reqError)
    return res.status(500).send({
      message: "Could not send blood request!",
    });
  res.status(201).send("Shared Successfully");
};

//when someone accept to donate
exports.acceptBroadcast = async (req, res) => {
  const acceptCount = 3;
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .eq("id", parseInt(req.params.requestId));
  if (error)
    return res.status(500).send({
      message: "Could not complete request.",
    });
  if (data[0].accept < acceptCount) {
    const { data: request, reqError } = await supabase
      .from("requests")
      .update({ accept: 1 }); // should be increment
    const { data: user, userError } = await supabase
      .from("users")
      .select("phoneNumber")
      .eq("id", req.user.id);
    if (reqError || userError)
      return res.status(500).send({
        message: "Could not complete request.",
      });
    // Send message with directions.
    await confirmAcceptance({
      to: user.phoneNumber,
      latitude: request.latitude,
      longitude: request.longitude,
    });
    res.status(201).send({
      message: "Thank for accepting to save lives.",
    });
  } else {
    return res.status(200).send({
      message: "enough people have already accepted to donate.",
    });
  }
};
