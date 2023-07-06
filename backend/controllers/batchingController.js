import expressAsyncHandler from "express-async-handler";
import PurchaseOrder from "../models/purchase.js";
import Storage from "../models/storage.js";

export const getSrvi = expressAsyncHandler(async (req, res) => {
  const srviDetails = await PurchaseOrder.find({
    "grn.isApproved": true,
  }).select("_id name");

  if (!srviDetails) {
    res.status(204);
    throw new Error("No Storages found!.");
  }

  res.json({ srviDetails });
});

export const batchChemical = expressAsyncHandler(async (req, res) => {
  const { id, name, tank, mgd, weight } = req.body;

  if (!id || !name || !tank || !mgd || !weight) {
    res.status(404);
    throw new Error("All fields are required!.");
  }

  const batchingChemical = await PurchaseOrder.findById(id).select(
    " poNumber weight"
  );
  const storageUpdate = await Storage.findOne({
    "storageDetails.poNumber": batchingChemical.poNumber,
  }).select("storageDetails usageDetails ");

  if (!storageUpdate) {
    res.status(404);
    throw new Error("No Storage Found!.");
  }

  let newArray;
  let duration;
  let calculate = new Date();

  newArray = storageUpdate.usageDetails;

  if (!newArray.length) {
    duration = calculate.getTime();
  }
  if (newArray.length) {
    duration = newArray[newArray.length - 1]["startBatch"];
    duration = duration.getTime();
  }

  newArray.push({
    count: newArray.length + 1,
    tank: tank,
    mgd: mgd,
    startBatch: calculate,
    totalDuration: convertMsToTime(
      calculate - newArray[newArray.length - 1].startBatch.getTime() ||
        calculate.getTime() - duration
    ),
    weight: weight,
    dosage: weight,
    user: req.user.name,
  });

  storageUpdate.storageDetails[0].currentStorage =
    storageUpdate.storageDetails[0].currentStorage - weight;
  // let filterStorage = StorageUpdate.map((x) => {
  //   x.storageDetails[0]["currentStorage"] =
  //     x.storageDetails[0]["currentStorage"] - weight;
  // });
  // console.log(StorageUpdate[0].storageDetails[0].currentStorage);
  // console.log(StorageUpdate[0].storageDetails);

  // StorageUpdate.storageDetails = filterStorage;
  // await storageUpdate.save();

  await storageUpdate.save();

  res.status(201).json({ status: "success", message: "updated" });
});

// Functions

function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  if (hours === 0) {
    if (minutes < 10) return `0.0${minutes}`;
    return `0.${minutes}`;
  }

  return hours;
}
