const express = require("express");
const router = express.Router();
const branchController = require("./branch.controller");
const { auth, authorize } = require("../../middleware/auth");

// All branch routes require authentication and SUPERADMIN role
router.use(auth);
router.use(authorize("SUPERADMIN"));

router.get("/stats", branchController.getStats);
router.get("/", branchController.getAllBranches);
router.get("/:id", branchController.getBranchById);
router.post("/", branchController.createBranch);
router.patch("/:id", branchController.updateBranch);
router.delete("/:id", branchController.deleteBranch);

module.exports = router;
