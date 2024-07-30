const mongoose = require('mongoose');
const axios = require('axios');

// Define the schema for pan shops
const panShopSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User" // Assuming you have a User model
    },
    panShopOwner: {
      type: String,
      required: true
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true
    },
    address: {
      type: String,
      required: true
    },
   
    // Add fields for storing latitude and longitude
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    state:{
      type:String ,
      required:true
    },
    qrCodeImage: {
      data: Buffer,
      contentType: String
  }
  },
{timestamps : true}
);
// Create a model from the schema
const PanShopOwner = mongoose.model('PanShopOwner', panShopSchema);

module.exports = PanShopOwner;