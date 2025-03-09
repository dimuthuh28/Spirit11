const Team = require("../models/Team");
const Player = require("../models/Player");
const User = require("../models/User");

// Constants
const INITIAL_BUDGET = 9000000; // Rs. 9,000,000
const TEAM_SIZE = 11;

// Create a new team for a user
exports.createTeam = async (req, res) => {
    try {
        const { userId } = req.body;

        // Check if user already has a team
        const existingTeam = await Team.findOne({ user: userId });
        if (existingTeam) {
            return res.status(400).json({ message: "User already has a team." });
        }

        // Create new team
        const newTeam = new Team({ user: userId, players: [], totalValue: 0, totalPoints: 0 });
        await newTeam.save();

        res.status(201).json({ message: "Team created successfully.", team: newTeam });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Add a player to the team
exports.addPlayer = async (req, res) => {
    try {
        const { userId, playerId } = req.body;

        const team = await Team.findOne({ user: userId }).populate("players");
        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }

        if (team.players.length >= TEAM_SIZE) {
            return res.status(400).json({ message: "Team must have exactly 11 players." });
        }

        // Check if player is already in the team
        if (team.players.some(p => p._id.toString() === playerId)) {
            return res.status(400).json({ message: "Player already in the team." });
        }

        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).json({ message: "Player not found." });
        }

        // Check if adding the player exceeds budget
        const newTotalValue = team.totalValue + player.price;
        if (newTotalValue > INITIAL_BUDGET) {
            return res.status(400).json({ message: "Not enough budget to add this player." });
        }

        // Add player
        team.players.push(playerId);
        team.totalValue = newTotalValue;
        await team.save();

        res.status(200).json({ message: "Player added successfully.", team });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Remove a player from the team
exports.removePlayer = async (req, res) => {
    try {
        const { userId, playerId } = req.body;

        const team = await Team.findOne({ user: userId });
        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }

        // Check if player is in the team
        if (!team.players.includes(playerId)) {
            return res.status(400).json({ message: "Player not in team." });
        }

        // Remove player
        const player = await Player.findById(playerId);
        team.players = team.players.filter(id => id.toString() !== playerId);
        team.totalValue -= player.price;
        await team.save();

        res.status(200).json({ message: "Player removed successfully.", team });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// View a user's team
exports.viewTeam = async (req, res) => {
    try {
        const { userId } = req.params;
        const team = await Team.findOne({ user: userId }).populate("players");

        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }

        res.status(200).json({ team });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Finalize the team (Lock-in)
exports.finalizeTeam = async (req, res) => {
    try {
        const { userId } = req.body;
        const team = await Team.findOne({ user: userId });

        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }

        if (team.players.length !== TEAM_SIZE) {
            return res.status(400).json({ message: `Team must have exactly ${TEAM_SIZE} players before finalizing.` });
        }

        team.finalized = true;
        await team.save();

        res.status(200).json({ message: "Team finalized successfully.", team });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Swap players
exports.swapPlayer = async (req, res) => {
    try {
        const { userId, oldPlayerId, newPlayerId } = req.body;
        const team = await Team.findOne({ user: userId });

        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }

        if (!team.players.includes(oldPlayerId)) {
            return res.status(400).json({ message: "Old player not in team." });
        }

        const newPlayer = await Player.findById(newPlayerId);
        if (!newPlayer) {
            return res.status(404).json({ message: "New player not found." });
        }

        // Check if new player is already in the team
        if (team.players.includes(newPlayerId)) {
            return res.status(400).json({ message: "New player already in team." });
        }

        // Budget check
        const oldPlayer = await Player.findById(oldPlayerId);
        const newTotalValue = team.totalValue - oldPlayer.price + newPlayer.price;
        if (newTotalValue > INITIAL_BUDGET) {
            return res.status(400).json({ message: "Not enough budget for swap." });
        }

        // Swap logic
        team.players = team.players.map(p => (p.toString() === oldPlayerId ? newPlayerId : p));
        team.totalValue = newTotalValue;
        await team.save();

        res.status(200).json({ message: "Player swapped successfully.", team });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Get leaderboard
exports.getLeaderboard = async (req, res) => {
    try {
        const teams = await Team.find({ finalized: true })
            .populate("user", "username")
            .sort({ totalPoints: -1 });

        res.status(200).json({ leaderboard: teams.map(t => ({ user: t.user.username, points: t.totalPoints })) });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};

// Get remaining budget
exports.getBudget = async (req, res) => {
    try {
        const { userId } = req.params;
        const team = await Team.findOne({ user: userId });

        if (!team) {
            return res.status(404).json({ message: "Team not found." });
        }

        res.status(200).json({ remainingBudget: INITIAL_BUDGET - team.totalValue });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
