const mongoose=require ('mongoose')

const productSchema = new mongoose.Schema({
    productNames: {
      type: String, // Array of product names
      required: [true, 'Please add at least one product name'],
    },
    
    // productSize: {
    //   type: String,
    //   required: [true, 'Please add the product size'],
    //   enum: ['Sm Bora', 'Medium Bora', 'Big Bora'],
    //   default: 'Sm Bora',
    // },
    
    quantity: {
      type: Number,
      required: [true, 'Please add the product quantity'],
      min: [0, 'Quantity must be at least 0'],
    },
    
    price:{
      type: Number,
      required: [true, 'Please add the product quantity'],
      min: [0, 'Quantity must be at least 0'],
    }
  });
  
  // Main Schema
  const panShopOrderSchema = new mongoose.Schema({
    products: [productSchema], // Array of productSchema
    totalPrice: {
      type: Number,
      default: 0,
    },
    superStockistEmail:{
      type:String,
      default:'',
    },
    stockistEmail:{
      type:String,
      default:'',
    },
    panShopOwner_id:{
      type:String,
      default:'',
    },
    panShopOwnerName:{
        type:String,
        default:'',
      },
      panShopOwnerstate:{
      type:String,
      default:'',
    },
    panShopOwneraddress:{
      type:String,
      default:'',
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered"],
      default: "pending"
  },

  otp: {
      type: Number,
      default: '',

  },
  assignTo: {
      type: String,
      default: '',

  },
  deliveryTime: {
      type: String,
      default: ""

  },
  },{timestamps:true});
  
  const panShopOrder = mongoose.model('panShopOrder', panShopOrderSchema);
  
  module.exports = panShopOrder;