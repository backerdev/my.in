import mongoose from "mongoose";

const storageSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
  },
  minStorage: {
    type: Number,
    require: [true, "Minimum storage amount is required"],
  },
  currentStorage: {
    type: Number,
    default: 0,
  },
  tanks: {
    type: Number,
    validate: {
      validator: function (val) {
        // this will not work on update
        return val <= 4;
      },
      message: "Please check the Tank input",
    },
  },
  unitPrice: {
    type: Number,
    require: [true, "Unitprice is required"],
  },
  weight: {
    type: Number,
    require: true,
  },
  vendors: {
    type: [
      { name: String, contractNo: String, expires: Date, startsFrom: Date },
    ],
    require: [true, "Vendor is a required field!"],
  },
  // lastBatchedOn: Date,

  storageDetails: {
    type: [
      {
        poNumber: Number,
        currentStorage: Number,
        originalWeight: Number,
        cost: Number,
      },
    ],
  },
  usageDetails: {
    type: [
      {
        count: Number,
        tank: Number,
        mgd: Number,
        startBatch: Date,
        totalDuration: Number,
        weight: Number,
        dosage: Number,
        user: String,
      },
    ],
  },
});

const Storage = mongoose.model("Storage", storageSchema);

export default Storage;
