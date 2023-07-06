import expressAsyncHandler from "express-async-handler";
import Storage from "../models/storage.js";

export const getStorages = expressAsyncHandler(async (req, res) => {
  const storages = await Storage.find();
  if (storages.length < 1) {
    return res
      .status(200)
      .json({ status: "success", message: "No Storages found!." });
  }

  return res
    .status(200)
    .json({ status: "success", results: storages.length, data: storages });
});

export const createNewStorage = expressAsyncHandler(async (req, res) => {
  const { name, minStorage, tanks, unitPrice, vendors } = req.body;
  console.log(req.body);
  if (!name || !minStorage || !tanks || !unitPrice || vendors.length !== 2) {
    res.status(404);
    throw new Error("All fields are required!.");
  }
  // check for existing Storage
  const existingStorage = await Storage.findOne({
    name: name.trim().toLowerCase(),
  });

  if (existingStorage) {
    res.status(409);
    throw new Error("Storage already exists!.");
  }
  // converts all fiels to lowercase then trim the inputs

  const newStorage = await Storage.create({
    name: name.trim().toLowerCase(),
    unitPrice: unitPrice,
    minStorage: minStorage,
    tanks: tanks,
    vendors: [
      {
        name: vendors[0]["name"],
        contractNo: vendors[0]["contractNo"],
        start: vendors[0]["start"],
        expires: vendors[0]["expires"],
      },
      {
        name: vendors[1]["name"],
        contractNo: vendors[1]["contractNo"],
        start: vendors[1]["start"],
        expires: vendors[1]["expires"],
      },
    ],
  });
  res.status(200).json({ status: "success", data: newStorage });
});

// /admin?id=64a1306cd81ed003fc89868a
export const updateStorage = expressAsyncHandler(async (req, res) => {
  const { id, minStorage, tanks, unitPrice, vendors } = req.body;
  if (!id && (!minStorage || !tanks || !unitPrice || vendors.length !== 2)) {
    res.status(404);
    throw new Error("Atleast one field is required!.");
  }
  const storageUpdate = await Storage.findById(id);
  if (!storageUpdate) {
    res.status(404);
    throw new Error("Invalid Id!.");
  }
  if (minStorage) {
    storageUpdate.minStorage = minStorage;
  }
  if (tanks) {
    storageUpdate.tanks = tanks;
  }
  if (unitPrice) {
    console.log(unitPrice);
    storageUpdate.unitPrice = unitPrice;
  }
  if (vendors) {
    storageUpdate.vendors = vendors;
  }
  const savedData = await storageUpdate.save();
  res.status(200).json({ status: "success", data: savedData });
});
export const deleteStorage = expressAsyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(404);
    throw new Error("Id is required!.");
  }
  const storageDelete = await Storage.findById(id);
  if (!storageDelete) {
    res.status(404);
    throw new Error("Invalid Id!.");
  }
  if (storageDelete.storageDetails.length > 0) {
    res.status(409);
    throw new Error("Unable to delete this storage!.");
  }
  await storageDelete.deleteOne();
  res.status(200).json({ status: "success", message: "Storage deleted!." });
});
