import expressAsyncHandler from "express-async-handler";
import Storage from "../models/storage.js";
import PurchaseOrder from "../models/purchase.js";

export const getStorageforPO = expressAsyncHandler(async (req, res) => {
  const StorageDetails = await Storage.find().select("name vendors");
  const AwaitingWeightPo = await PurchaseOrder.find({
    "grn.isWeight": false,
  }).select("name poNumber weight currentWeight");
  res.json({ StorageDetails, AwaitingWeightPo });
});
export const createPO = expressAsyncHandler(async (req, res) => {
  const { poNumber, weight, vendor, name } = req.body;

  if (!poNumber || !weight || !vendor) {
    res.status(404);
    throw new Error("All fields are required!.");
  }
  const StorageDetails = await Storage.findOne({
    name: name.toLowerCase(),
  }).select("name vendors -_id");
  // console.log(StorageDetails);
  if (!StorageDetails) {
    res.status(404);
    throw new Error("No Storage found!.");
  }

  const vendors = StorageDetails["vendors"];
  const isContract =
    vendors[0]["contractNo"] === vendor.contractNo ||
    vendors[1]["contractNo"] === vendor.contractNo;

  if (!isContract) {
    res.status(404);
    throw new Error("Invalid contract number!.");
  }
  const checkPo = await PurchaseOrder.findOne({ poNumber: poNumber });

  if (checkPo) {
    res.status(404);
    throw new Error("Purchase order number already exists!.");
  }

  let date1Array = vendor.expires.split("-").join("/");
  const index = vendors.findIndex((obj) => {
    return obj.contractNo === vendor.contractNo;
  });
  const date1 = new Date(date1Array);

  const date2 = new Date(vendors[index]["expires"]);
  if (date1 > date2) {
    res.status(404);
    throw new Error("Please check the date!");
  }

  const newPurchaseOrder = await PurchaseOrder.create({
    name: StorageDetails.name,
    poNumber: poNumber,
    weight: parseInt(weight),
    poDetails: {
      vendor: vendor.name,
      contractNo: vendor.contractNo,
      expires: vendor.expires,
    },
    creatorInfo: req.user.name,
  });
  return res.status(200).json({ status: "success", data: newPurchaseOrder });
});

export const updatePO = expressAsyncHandler(async (req, res) => {
  const { id, weight, uweight, expires } = req.body;

  if (!id && (!parseInt(weight) || !parseInt(uweight) || !expires)) {
    res.status(404);
    throw new Error("Id and one other field is required");
  }
  if (!parseInt(weight) && !parseInt(uweight) && !expires) {
    res.status(404);
    throw new Error("Id and one other field is required");
  }

  const existingPO = await PurchaseOrder.findById(id);
  const existingStorage = await Storage.findOne({ name: existingPO?.name });
  if (!existingPO) {
    res.status(404);
    throw new Error("No Id found!.");
  }
  if (parseInt(weight) && parseInt(uweight)) {
    res.status(404);
    throw new Error(
      "unable to update both weight and update delivery together!."
    );
  }
  const isWeightAchived =
    existingPO.currentWeight + parseInt(uweight) === existingPO.weight;
  if (isWeightAchived) {
    existingPO.grn.isWeight = true;
  }
  if (existingPO.currentWeight + parseInt(uweight) > existingPO.weight) {
    res.status(404);
    throw new Error(
      `unable to update weight as it exceed the approved weight!. Current weight ${existingPO.currentWeight}`
    );
  }
  if (weight) {
    existingPO.weight = parseInt(weight);
  }
  if (uweight) {
    const delivery = {
      weight: parseInt(uweight),
      arrivedAt: new Date(),
      creatorInfo: req.user.name,
    };

    let deliveryArray = existingPO.delivery;
    deliveryArray.push(delivery);

    existingPO.delivery = deliveryArray;
    const sum = existingPO.currentWeight + parseInt(uweight);

    existingPO.currentWeight = sum;
  }

  if (expires) {
    const index = existingStorage.vendors.findIndex((obj) => {
      return obj.contractNo === existingPO.poDetails.contractNo;
    });
    if (!existingStorage.vendors[index]["expires"] > expires) {
      res.status(404);
      throw new Error("unable to update the expiry date!.");
    }

    existingPO.expires = expires;
  }
  await existingPO.save();
  res.status(201).json({
    status: "success",
    isWeightAchived: isWeightAchived,
    message: "Changes have been updated!.",
  });
});
