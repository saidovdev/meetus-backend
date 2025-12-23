import User from "../../models/User.js";

export const searchEngine = async (req, res) => {
  try {
    const query = req.query.q?.trim();
console.log("f");

    if (!query || query.length === 0) {
      return res.status(200).json([]);
    }

    const users = await User.find(
      {
        $or: [
          { username: { $regex: "^" + query, $options: "i" } },
          { fullname: { $regex: "^" + query, $options: "i" } },
        ],
      },
      {
        password: 0,
        email: 0,
      }
    ).limit(20);

    res.status(200).json(users);
  } catch (error) {
    console.log("Error occurred while search engine", error);
    return res.status(500).json({ error: "Internal server Error" });
  }
};
