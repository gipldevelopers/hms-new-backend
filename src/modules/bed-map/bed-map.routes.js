const express = require("express");
const router = express.Router();
const bedMapController = require("./bed-map.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);
// Both Admins and Staff can view the Bed Map
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF"));

router.get("/hierarchy", bedMapController.getBedMapData);

module.exports = router;
