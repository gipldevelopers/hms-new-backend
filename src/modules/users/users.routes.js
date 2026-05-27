const express = require("express");
const router = express.Router();
const userController = require("./users.controller");
const { auth, authorize } = require("../../middleware/auth");
const auditLogger = require("../../middleware/audit-logger");

// Protection & Logging
router.use(auth);
router.get("/me", (req, res) => {
  const user = JSON.parse(JSON.stringify(req.user));
  if (user.isRestricted) {
    user.consoleRoles = [];
  }
  res.json({ success: true, data: user });
});
router.put("/me", userController.updateMe);

// Staff need to fetch doctor lists for clinical operations
router.get("/", authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF"), userController.getAllUsers);

// Management routes restricted to Admins
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN"));
router.use(auditLogger("USER_MANAGEMENT"));

router.get("/stats", userController.getStats);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
