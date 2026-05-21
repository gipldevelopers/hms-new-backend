const express = require("express");
const router = express.Router();
const tasksController = require("./tasks.controller");
const { auth, authorize } = require("../../middleware/auth");

router.use(auth);
router.use(authorize("SUPERADMIN", "BRANCH_ADMIN", "STAFF", "DOCTOR"));

router.get("/", tasksController.getTasks);
router.get("/filters", tasksController.getTasksFilters);
router.post("/", tasksController.createTask);
router.get("/:id", tasksController.getTaskById);
router.patch("/:id", tasksController.updateTask);

module.exports = router;
