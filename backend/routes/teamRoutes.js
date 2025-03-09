const express = require("express");
const router = express.Router();
const teamController = require("../controllers/teamController");

// Team Routes
router.post("/create", teamController.createTeam); // Create a new team
router.post("/addPlayer", teamController.addPlayer); // Add a player to the team
router.delete("/removePlayer", teamController.removePlayer); // Remove a player from the team
router.get("/:userId", teamController.viewTeam); // View a user's team
router.post("/finalize", teamController.finalizeTeam); // Finalize the team
router.post("/swap", teamController.swapPlayer); // Swap players in the team
router.get("/leaderboard", teamController.getLeaderboard); // Get the leaderboard
router.get("/budget/:userId", teamController.getBudget); // Get remaining budget

module.exports = router;
