const express = require("express");
const { getPanShopOwnerById, getAllOrderHistroyByShopOwnerId } = require("../controllers/panShopOrderController");

const router = express.Router();

router.route("/:id").get(getPanShopOwnerById);

router.route("/orderHistroy/:id").get(getAllOrderHistroyByShopOwnerId)
module.exports = router;