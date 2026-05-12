const express = require("express");
const router = express.Router();
const bedMapController = require("./bed-map.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);
// Both Admins, Staff and Reception can view the Bed Map
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF", "RECEPTION"));

router.get("/hierarchy", bedMapController.getBedMapData);

module.exports = router;
