const supabase = require("../utils/db.utils");

exports.feedsByMe = async (req, res) => {
  const { data: feeds, error } = await supabase
    .from("feeds")
    .select("*")
    .eq("userId", req.user.id);
  if (error) {
    return res.status(500).send({
      message: "Failed to fetch donation feed.",
    });
  }
  res.status(200).send(feeds);
};

exports.getFeeds = async (req, res) => {
  const { data: feeds, error } = await supabase.from("feeds").select("*");
  if (error) {
    return res.status(500).send({
      message: "Failed to fetch donation feed.",
    });
  }
  res.status(200).send(feeds);
};

exports.createFeed = async (req, res) => {
  const { data, error } = await supabase.from("feeds").insert([
    {
      information: req.body.description,
      media: req.file.filename,
      userId: req.user.id,
    },
  ]);
  if (error) {
    return res.status(500).send({
      message: "Failed to Create Feed",
    });
  }
  res.status(201).send({
    message: "Donation BroadCast Success.",
    "data": data
  });
};

exports.attendDrive = async (req, res) => {
  const { data, error } = await supabase
    .from("feeds")
    .update({
      going: {
        increment: 1,
      },
    })
    .eq("id", parseInt(req.params.feedID))
    .select();
  if (error) {
    return res.status(500).send({ message: "Error, Accepting drive!" });
  }
  res.status(200).send({ message: "Accepted to attend drive." });
};
