const mongoose = require("mongoose");

const UniqueUserSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, required: true, unique: true },
    belowAccounts: [
      {
        userId: { type: String, required: true },
        password: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UniqueUser", UniqueUserSchema);
