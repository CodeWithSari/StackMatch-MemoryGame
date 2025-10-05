import React from "react";
import { Box, Button } from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import GameBoard from "./components/GameBoard.jsx";
import Leaderboard from "./pages/LeaderBoard.jsx";

function App() {
  return (
    <Box>
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Button component={Link} to="/" variant="contained" sx={{ mr: 2 }}>
          Game
        </Button>
        <Button component={Link} to="/leaderboard" variant="outlined">
          Leaderboard
        </Button>
      </Box>

      <Routes>
        <Route path="/" element={<GameBoard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Box>
  );
}

export default App;
