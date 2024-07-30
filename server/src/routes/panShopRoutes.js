const express = require("express");
const {createPanShopOrder ,getPanShopOrderById, updateEmail }= require("../controllers/panShopOrderController");

const router = express.Router();



router.route("/").post(createPanShopOrder);
// router.route("/").get(getPanShopOrder)
router.route("/:id").get(getPanShopOrderById)
router.route("/:id").patch(updateEmail)

// router.route("/:id").get(getPanShopOwnerById);
module.exports = router;