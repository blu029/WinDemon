const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Built-in CORS middleware to handle hybrid app requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

const LEADERBOARD_FILE = path.join(__dirname, 'leaderboard.json');

// Initialize leaderboard if it doesn't exist
const DEFAULT_LEADERBOARD = [
  { rank: 1, name: 'SilverMind #402', score: 2850, badge: 'Grandmaster' },
  { rank: 2, name: 'MindGlow #502', score: 2150, badge: 'Expert' },
  { rank: 3, name: 'CalmRiver #881', score: 1980, badge: 'Scholar' },
  { rank: 4, name: 'StarSeeker #771', score: 1720, badge: 'Explorer' }
];

function getLeaderboard() {
  if (!fs.existsSync(LEADERBOARD_FILE)) {
    fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(DEFAULT_LEADERBOARD, null, 2));
    return DEFAULT_LEADERBOARD;
  }
  try {
    const data = fs.readFileSync(LEADERBOARD_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return DEFAULT_LEADERBOARD;
  }
}

function saveLeaderboard(data) {
  fs.writeFileSync(LEADERBOARD_FILE, JSON.stringify(data, null, 2));
}

// Routes
app.get('/api/leaderboard', (req, res) => {
  res.json(getLeaderboard());
});

app.post('/api/leaderboard', (req, res) => {
  const { name, score, badge, isCurrent } = req.body;
  if (!name || score === undefined) {
    return res.status(400).json({ error: 'Name and score are required' });
  }

  let leaderboard = getLeaderboard();
  
  // Find if player already exists by name or isCurrent flag
  let player = leaderboard.find(p => p.name === name || (isCurrent && p.isCurrent));
  if (player) {
    // Keep the highest score
    if (score > player.score) {
      player.score = score;
    }
  } else {
    leaderboard.push({ name, score, badge, isCurrent });
  }

  // Sort and re-rank
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.map((p, idx) => ({
    rank: idx + 1,
    name: p.name,
    score: p.score,
    badge: p.badge,
    isCurrent: p.isCurrent
  })).slice(0, 10); // Keep top 10 rankings

  saveLeaderboard(leaderboard);
  res.json(leaderboard);
});

app.listen(PORT, () => {
  console.log(`WinDemon Backend running on http://localhost:${PORT}`);
});
