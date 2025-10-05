import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

function Leaderboard() {
  const [level, setLevel] = useState("Easy");
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const storedScores = JSON.parse(localStorage.getItem("stackMatchLeaderboard")) || {};
    setScores(storedScores[level] || []);
  }, [level]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        color: "#fff",
      }}
    >
      {/* Title */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textShadow: "0px 0px 12px rgba(0, 255, 255, 0.7)",
        }}
      >
        🏆 LeaderBoard
      </Typography>

      {/* Level Dropdown */}
      <FormControl
        sx={{
          mb: 3,
          minWidth: 180,
          bgcolor: "rgba(255, 255, 255, 0.1)",
          borderRadius: 2,
          boxShadow: "0 0 15px rgba(0, 255, 255, 0.3)",
          "& .MuiInputLabel-root": { color: "#00e5ff" },
          "& .MuiSelect-select": { color: "#fff" },
          "& .MuiOutlinedInput-notchedOutline": { borderColor: "#00e5ff" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00bcd4" },
        }}
      >
        <InputLabel>Level</InputLabel>
        <Select
          value={level}
          label="Level"
          onChange={(e) => setLevel(e.target.value)}
        >
          <MenuItem value="Easy">Easy</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Hard">Hard</MenuItem>
        </Select>
      </FormControl>

      {/* Table */}
      <Paper
        sx={{
          maxWidth: 700,
          width: "100%",
          p: 3,
          bgcolor: "rgba(30, 30, 30, 0.9)",
          borderRadius: 3,
          boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
          color: "#fff",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#00e5ff", fontWeight: "bold" }}>Rank</TableCell>
              <TableCell sx={{ color: "#00e5ff", fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ color: "#00e5ff", fontWeight: "bold" }}>Score</TableCell>
              <TableCell sx={{ color: "#00e5ff", fontWeight: "bold" }}>Moves</TableCell>
              <TableCell sx={{ color: "#00e5ff", fontWeight: "bold" }}>Time (s)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scores.length > 0 ? (
              scores
                .sort((a, b) => b.score - a.score)
                .map((player, i) => (
                  <TableRow
                    key={i}
                    sx={{
                      "&:hover": { bgcolor: "rgba(0,255,255,0.1)" },
                    }}
                  >
                    <TableCell sx={{ color: "#fff" }}>{i + 1}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{player.name}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{player.score}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{player.moves}</TableCell>
                    <TableCell sx={{ color: "#fff" }}>{player.time}</TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: "#aaa" }}>
                  No scores yet for {level} level.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}

export default Leaderboard;
