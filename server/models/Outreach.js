const mongoose = require("mongoose");


const outreachSchema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
      trim: true
    },


    category: {
      type: String,
      required: true,
      trim: true
    },


    description: {
      type: String,
      required: true,
      trim: true
    },


    imageUrl: {
      type: String,
      required: true
    },


    date: {
      type: Date,
      default: Date.now
    },


    location: {
      type: String,
      trim: true,
      default: ""
    },


    peopleHelped: {
      type: Number,
      default: 0,
      min: 0
    },


    status: {
      type: String,
      enum: [
        "Active",
        "Inactive"
      ],
      default: "Active"
    }

  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model(
  "Outreach",
  outreachSchema
);