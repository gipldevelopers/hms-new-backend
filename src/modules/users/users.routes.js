const express = require("express");
const router = express.Router();
const userController = require("./users.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Protection & Logging
router.use(auth);
router.use(authorize("SUPERADMIN"));
router.use(auditLogger("USER_MANAGEMENT"));

router.get("/", userController.getAllUsers);
router.get("/stats", userController.getStats);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
