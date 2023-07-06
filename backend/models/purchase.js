import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Name is required"],
  },
  poNumber: {
    type: Number,
    require: [true, "Purchase number is required"],
  },
  weight: {
    type: Number,
    require: [true, "Weight is required"],
  },
  currentWeight: {
    type: Number,
    default: 0,
  },

  delivery: {
    type: [{ weight: Number, arrivedAt: Date, creatorInfo: String }],
  },

  poDetails: {
    type: {
      vendor: String,
      cost: String,
      contractNo: String,
      expires: Date,
      startsFrom: Date,
    },
    require: [true, "poDetails are required field!"],
  }, // role: { type: String, default: 'guitarist' }
  grn: {
    type: {
      isApproved: Boolean,
      isWeight: Boolean,
      labResult: {
        type: String,
        enum: ["NY", "Pending", "Fail", "Pass"],
        default: "NY",
      },
    },
    default: {
      isApproved: false,
      isWeight: false,
    },
  },
  creatorInfo: {
    type: String,
    require: true,
  },
  // usageDetails: {
  //   type: [
  //     {
  //       tank: Number,
  //       mgd: Number,
  //       startBatch: Date,
  //       totalDuration: Number,
  //       weight: Number,
  //       dosage: Number,
  //       user: String,
  //     },
  //   ],
  // },
});
const PurchaseOrder = mongoose.model("PurchaseOrder", purchaseSchema);

export default PurchaseOrder;
