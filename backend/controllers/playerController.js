const Player = require('../models/Player');

// Create a new player
exports.createPlayer = async (req, res) => {
  try {
    const { firstName, lastName, university, category, stats } = req.body;
    const player = new Player({
      firstName,
      lastName,
      university,
      category,
      stats,
    });

    await player.save();
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create player', message: error.message });
  }
};

// Get all players
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players', message: error.message });
  }
};

// Get a single player by ID
exports.getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch player', message: error.message });
  }
};

// Update a player
exports.updatePlayer = async (req, res) => {
  try {
    const { firstName, lastName, university, category, stats } = req.body;
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, university, category, stats },
      { new: true }
    );
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(200).json(player);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update player', message: error.message });
  }
};

// Delete a player
exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete player', message: error.message });
  }
};

// Calculate player stats (can be used if needed manually)
exports.calculatePlayerStats = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Calculate stats using the method in the player model
    player.calculateStats();
    await player.save();

    res.status(200).json(player);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate player stats', message: error.message });
  }
};
