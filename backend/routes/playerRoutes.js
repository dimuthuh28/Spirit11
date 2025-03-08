const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');

// Routes for Player actions
router.post('/players', playerController.createPlayer); 
router.get('/', playerController.getAllPlayers); 
router.get('/:id', playerController.getPlayerById); // Get player by ID
router.put('/:id', playerController.updatePlayer); // Update player
router.delete('/:id', playerController.deletePlayer); // Delete player
router.post('/:id/calculate-stats', playerController.calculatePlayerStats); 

module.exports = router;
