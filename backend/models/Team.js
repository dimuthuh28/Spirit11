const TeamSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  players: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
    validate: {
      validator: function (players) {
        return players.length === 11;
      },
      message: "A team must have exactly 11 players."
    },
    required: true
  },
  totalValue: { type: Number, required: true }, // Sum of player prices
  totalPoints: { type: Number, default: 0 }, // Hidden from users
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Team", TeamSchema);
