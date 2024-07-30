
const asyncHandler = require("express-async-handler");
const axios = require('axios');
const qrcode = require('qrcode');
const fs = require('fs');

const panShopOrder = require('../model/panShopOrderModel');

const PanShopOwner=require("../model/panShopOwnerModel")

const createPanShopOrder = async (req, res) => {
  const { products, superStockistEmail, stockistEmail, panShopOwner_id,panShopOwnerName, panShopOwnerstate, panShopOwneraddress, status ,deliveryTime,assignTo,otp} = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Products array is required and cannot be empty" });
  }

  const totalPrice = products.reduce((acc, product) => acc + product.quantity * product.price, 0);

  try {
    const order = await panShopOrder.create({
      products,
      totalPrice,
      superStockistEmail,
      stockistEmail,
      panShopOwner_id,
      panShopOwnerName, // Assuming this is static for now
      panShopOwnerstate,
      panShopOwneraddress,
      status,
      deliveryTime,
      assignTo,
      otp
    });

    res.status(201).json(order); // Return the created order
  } catch (error) {
    console.error("Error creating pan shop order:", error);
    res.status(500).json({ error: "Failed to create pan shop order" });
  }
};

const getPanShopOrderById = async (req, res) => {
    const { id } = req.params;

    try {
        const order = await panShopOrder.findById(id);
        if (!order) {
            res.status(404).json({ error: "Order not found" });
            return;
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to retrieve order" });
    }
};

const updateEmail = async (req, res) => {
    const { id } = req.params;

    try {
        const existingOrder = await panShopOrder.findById(id);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        const { superStockistEmail, stockistEmail, ...updateData } = req.body;

        if (superStockistEmail) existingOrder.superStockistEmail = superStockistEmail;
        if (stockistEmail) existingOrder.stockistEmail = stockistEmail;

        for (let key in updateData) {
            existingOrder[key] = updateData[key];
        }

        const updatedOrder = await existingOrder.save();
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update order" });
    }
};

const getPanShopOwnerById = asyncHandler(async (req, resp) => {
    const owner = await PanShopOwner.findById(req.params.id);
    
    if (!owner) {
        resp.status(404);
        throw new Error("PanShop Owner Not Found");
    }
    
    // Generate QR code data
    const qrData = JSON.stringify(
    //     Id :owner._id,
    //     panShopOwner: owner.panShopOwner,
    //     order:`https://663b53142e23fd23e5bb5044--incomparable-croquembouche-3e3d82.netlify.app/login/${owner._id} `
    
    `https://663b53142e23fd23e5bb5044--incomparable-croquembouche-3e3d82.netlify.app/login/${owner._id} ` 
    );
    
    // Generate QR code image
    const qrImageFilePath = `qr_$owner._id}.png`; // File path for the QR code image
    await qrcode.toFile(qrImageFilePath, qrData);

    // Read the QR code image file as a buffer
    const qrImageData = fs.readFileSync(qrImageFilePath);

    // Delete the QR code image file after reading it
    fs.unlinkSync(qrImageFilePath);

    // Convert QR code image data to base64
    const qrCodeBase64 = qrImageData.toString('base64');

    // Store the QR code image data in the pan shop owner object
    owner.qrCodeImage = {
        data: qrImageData,
        contentType: 'image/png' // Adjust according to the image format
    };

    // Send the pan shop owner details along with the base64 representation of the QR code
    resp.status(200).json({ qrCodeBase64, owner });
});


const getAllOrderHistroyByShopOwnerId = asyncHandler(async (req, resp) => {
    try {
      const id =req.params.id 
      const owner= await PanShopOwner.findById(id);
      if(!owner){
        resp.status(404).json({message: "User Doesn't Exist"})
      }
      const orders = await panShopOrder.aggregate([{
        $match: {
          panShopOwner_id:id// Corrected field name to panShopOwner_id
        }
      },
      
      {
        $project: {
          _id: 1,
          "products.productNames": 1, // Access nested field
          "products.quantity": 1,
          "products.price": 1,
          totalPrice: 1,
          superStockistEmail: 1,
          stockistEmail: 1,
          panShopOwner_id: 1, // Corrected field name to panShopOwner_id
          panShopOwnerName: 1,
          panShopOwneraddress: 1,
          panShopOwnerstate: 1,
          createdAt: 1,
          updatedAt: 1,
          __v: 1
        }
      }
    ])
  
      console.log(orders);
  
      // Send the orders back as a response
      resp.status(200).json({ success: true, orders });
    } catch (error) {
      // Handle any errors
      resp.status(500).json({ success: false, message: "PanShopOwner  Doesn't Exist" });
    }
  });
  
  


module.exports = { createPanShopOrder, getPanShopOrderById, updateEmail ,getPanShopOwnerById ,getAllOrderHistroyByShopOwnerId};