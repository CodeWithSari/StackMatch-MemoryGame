import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Typography,
  Button,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Card from "./Card.jsx";
import NameInputModal from "./NameInputModal.jsx";
import { DiJavascript1, DiReact, DiPython } from "react-icons/di";
import {
  SiAngular,
  SiNodedotjs,
  SiMongodb,
  SiTypescript,
  SiRedux,
  SiDocker,
  SiKubernetes,
} from "react-icons/si";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

import flipSoundFile from "../assets/sounds/flip.mp3";
import matchSoundFile from "../assets/sounds/match.mp3";
import winSoundFile from "../assets/sounds/win.mp3";

//  MUI Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";
import TimerIcon from "@mui/icons-material/Timer";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";

const techIcons = [
  { key: "js", component: <DiJavascript1 size={40} color="#F7DF1E" /> },
  { key: "react", component: <DiReact size={40} color="#61DAFB" /> },
  { key: "python", component: <DiPython size={40} color="#3776AB" /> },
  { key: "angular", component: <SiAngular size={40} color="#DD0031" /> },
  { key: "node", component: <SiNodedotjs size={40} color="#68A063" /> },
  { key: "mongo", component: <SiMongodb size={40} color="#47A248" /> },
  { key: "ts", component: <SiTypescript size={40} color="#3178C6" /> },
  { key: "redux", component: <SiRedux size={40} color="#764ABC" /> },
  { key: "docker", component: <SiDocker size={40} color="#2496ED" /> },
  { key: "k8s", component: <SiKubernetes size={40} color="#326CE5" /> },
];

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

function GameBoard() {
  const { width, height } = useWindowSize();
  const [level, setLevel] = useState("Easy");
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highScores, setHighScores] = useState(
    JSON.parse(localStorage.getItem("stackMatchHighScore")) || {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    }
  );
  const [unlockedLevels, setUnlockedLevels] = useState(["Easy"]);

  const flipSound = useRef(new Audio(flipSoundFile));
  const matchSound = useRef(new Audio(matchSoundFile));
  const winSound = useRef(new Audio(winSoundFile));

  const levelPairs = { Easy: 3, Medium: 6, Hard: 9 };

  const buildCards = () => {
    const pairCount = levelPairs[level];
    const selected = techIcons.slice(0, pairCount);
    return shuffle([...selected, ...selected]).map((item, index) => ({
      id: index,
      key: `${item.key}-${index}`,
      iconComponent: item.component,
    }));
  };

  const startNewGame = () => {
    setCards(buildCards());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setTime(0);
    setShowConfetti(false);
    setIsGameActive(false);
  };

  useEffect(() => startNewGame(), [level]);

  useEffect(() => {
    if (!isGameActive) return;
    const timer = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [isGameActive]);

  useEffect(() => {
    if (flipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstId, secondId] = flipped;
      const firstKey = cards.find((c) => c.id === firstId).key.split("-")[0];
      const secondKey = cards.find((c) => c.id === secondId).key.split("-")[0];

      if (firstKey === secondKey) {
        setMatched((prev) => [...prev, firstId, secondId]);
        matchSound.current.currentTime = 0;
        matchSound.current.play();
      }

      const timer = setTimeout(() => setFlipped([]), 800);
      return () => clearTimeout(timer);
    }
  }, [flipped]);

 useEffect(() => {
  if (matched.length && matched.length === cards.length) {
    setIsGameActive(false);
    if (!showConfetti) {
      setShowConfetti(true);
      winSound.current.play();
    }

    const score = Math.max(0, 1000 - moves * 10 - time);
    if (score > highScores[level]) {
      setModalOpen(true);
    }

    // Unlock next level
    if (level === "Easy" && !unlockedLevels.includes("Medium"))
      setUnlockedLevels([...unlockedLevels, "Medium"]);
    if (level === "Medium" && !unlockedLevels.includes("Hard"))
      setUnlockedLevels([...unlockedLevels, "Hard"]);

    // Auto reset cards to starting face after 4 seconds
    setTimeout(() => {
      startNewGame();
    }, 4000);
  }
}, [matched]);

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleFlip = (card) => {
    if (
      !isGameActive ||
      flipped.length === 2 ||
      flipped.includes(card.id) ||
      matched.includes(card.id)
    )
      return;

    flipSound.current.currentTime = 0;
    flipSound.current.play();
    setFlipped([...flipped, card.id]);
  };

  const saveScore = (playerName) => {
    const score = Math.max(0, 1000 - moves * 10 - time);
    const leaderboard =
      JSON.parse(localStorage.getItem("stackMatchLeaderboard")) || {
        Easy: [],
        Medium: [],
        Hard: [],
      };
    leaderboard[level].push({ name: playerName, score, moves, time });
    leaderboard[level] = leaderboard[level]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    localStorage.setItem("stackMatchLeaderboard", JSON.stringify(leaderboard));

    const updatedHighScores = { ...highScores, [level]: score };
    setHighScores(updatedHighScores);
    localStorage.setItem("stackMatchHighScore", JSON.stringify(updatedHighScores));
    setModalOpen(false);
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 4,
        minHeight: "100vh",
        color: "#E0E0E0",
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        backgroundAttachment: "fixed",
      }}
    >
      {showConfetti && <Confetti width={width} height={height} />}

      {/* Level Select */}
      <FormControl
        sx={{
          mb: 3,
          minWidth: 150,
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: 2,
          "& .MuiOutlinedInput-root": {
            color: "#fff",
            boxShadow: "0 0 8px #00e5ff",
          },
          "& .MuiInputLabel-root": { color: "#8aedfa" },
        }}
      >
        <InputLabel>Level</InputLabel>
        <Select
          value={level}
          label="Level"
          onChange={(e) => setLevel(e.target.value)}
          sx={{
            color: "#fff",
            "&:hover": { boxShadow: "0 0 20px #00e5ff" },
          }}
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium" disabled={!unlockedLevels.includes("Medium")}>
            Medium
          </MenuItem>
          <MenuItem value="Hard" disabled={!unlockedLevels.includes("Hard")}>
            Hard
          </MenuItem>
        </Select>
      </FormControl>

      {/* Stats */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccessTimeIcon color="primary" /> Time: {time}s
        </Typography>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SportsScoreIcon color="secondary" /> Moves: {moves}
        </Typography>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EmojiEventsIcon color="warning" /> High Score ({level}): {highScores[level]}
        </Typography>
      </Box>

      {/* Buttons */}
      {!isGameActive ? (
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={() => setIsGameActive(true)}
          sx={{
            mt: 1,
            mb: 3,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #00ffcc, #00b3ff)",
            boxShadow: "0 0 15px #00b3ff",
            "&:hover": { boxShadow: "0 0 25px #00b3ff" },
          }}
        >
          Start Game
        </Button>
      ) : (
        <Button
          variant="contained"
          startIcon={<ReplayIcon />}
          onClick={startNewGame}
          sx={{
            mt: 1,
            mb: 3,
            fontWeight: "bold",
            background: "linear-gradient(90deg, #ff0055, #ff00cc)",
            boxShadow: "0 0 15px #ff00cc",
            "&:hover": { boxShadow: "0 0 25px #ff00cc" },
          }}
        >
          Reset
        </Button>
      )}

      {/* Cards */}
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        {cards.map((card) => (
          <Grid item key={card.id} xs={4} sm={3} md={2}>
            <Card
              card={card}
              flipped={flipped.includes(card.id) || matched.includes(card.id)}
              onClick={() => handleFlip(card)}
            />
          </Grid>
        ))}
      </Grid>

      {/* How to Play */}
      <Box
        sx={{
          mt: 6,
          mx: "auto",
          maxWidth: 600,
          textAlign: "left",
          bgcolor: "rgba(255,255,255,0.05)",
          borderRadius: 2,
          p: 3,
          boxShadow: "0 0 25px rgba(0,255,255,0.3)",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            color: "#00e5ff",
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <SportsEsportsIcon sx={{ color: "#00e5ff" }} /> How to Play
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          🎯 Select your difficulty level (<b>Easy / Medium / Hard</b>).
          Initially, only <b>Easy</b> level is unlocked.
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <PlayArrowIcon color="success" /> Click <b>Start Game</b> to begin.
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <FlipCameraAndroidIcon color="info" /> Flip two cards — if they match, they stay open.
        </Typography>

        <Typography
          variant="body1"
          sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
        >
          <EmojiEventsIcon color="warning" /> Match all pairs to win the level.
        </Typography>
<Typography
  variant="body1"
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1,
    textAlign: {
      xs: "justify",
      sm: "center", 
    },
    flexWrap: "wrap",
  }}
>
  <TimerIcon color="primary" /> <ScoreboardIcon color="secondary" /> Your time, moves,
  and score will be recorded in the <b>Leaderboard</b>.
</Typography>
      </Box>

      {/* Name Input Modal */}
      <NameInputModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={saveScore} />
    </Box>
  );
}

export default GameBoard;
