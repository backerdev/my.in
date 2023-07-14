import expressAsyncHandler from "express-async-handler";
import PurchaseOrder from "../models/purchase.js";
import Storage from "../models/storage.js";
const labArray = ["Pending", "NY", "Pass", "Fail"];
export const getAllQcPo = expressAsyncHandler(async (req, res) => {
  const awaitingPo = await PurchaseOrder.find({
    "grn.isWeight": true,
    // "grn.labResult": { $ne: "Pass" },
  }).select("poNumber _id name weight grn.labResult");

  res.json({ awaitingPo });
});
export const updateGrnPo = expressAsyncHandler(async (req, res) => {
  const { id, labTest } = req.body;

  const poDetails = await PurchaseOrder.findById(id);
  console.log(req.body);
  if (!labArray.includes(labTest)) {
    res.status(404);
    throw new Error("Invalid Lab Result");
  }
  if (!id || !poDetails) {
    res.status(404);
    throw new Error("Invalid id");
  }

  if (labTest === "Pending") {
    poDetails.grn.labResult = labTest;
  }
  if (labTest === "Pass" && poDetails.currentWeight === poDetails.weight) {
    poDetails.grn.labResult = labTest;
    poDetails.grn.isApproved = true;
    const StorageDetails = await Storage.findOne({ name: poDetails.name });
    StorageDetails.currentStorage = poDetails.weight;
    let newArray;

    newArray = StorageDetails.storageDetails;
    newArray.push({
      poNumber: poDetails.poNumber,
      currentStorage: poDetails.weight,
      originalWeight: poDetails.weight,
      cost: poDetails.weight * StorageDetails.unitPrice,
    });
    StorageDetails.storageDetails = newArray;
    await StorageDetails.save();
  }
  if (labTest === "Fail") {
    poDetails.grn.labResult = labTest;
  }

  await poDetails.save();

  res.status(200).json({
    status: "success",

    message: "Updated successfully!.",
  });
});

export const deletePO = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    res.status(404);
    throw new Error("Invalid Id!.");
  }

  const existingPo = await PurchaseOrder.findById(id);
  if (!existingPo || existingPo?.grn?.isApproved === true) {
    if (!existingPo) {
      res.status(404);
      throw new Error("No PO found!.");
    }
    res.status(404);
    throw new Error("Unable to attend to request as PO has been approved!.");
  }
  await existingPo.deleteOne();
  res.status(201).json({
    status: "success",
    message: `Purchase Order no:${existingPo.poNumber} has been deleted!.`,
  });
});
