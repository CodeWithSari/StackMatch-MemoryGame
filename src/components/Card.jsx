import React from "react";
import { Box } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"; // MUI question icon

function Card({ card, flipped, onClick }) {
  return (
    <Box
      onClick={onClick}
      className="card"
      sx={{
        width: { xs: 70, sm: 90, md: 120, lg: 140 },
        height: { xs: 90, sm: 110, md: 150, lg: 170 },
        perspective: "1000px",
        cursor: "pointer",
        margin: "auto",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.6s",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          boxShadow: flipped
            ? "0 8px 20px rgba(0,0,0,0.5)"
            : "0 4px 6px rgba(0,0,0,0.2)",
          borderRadius: 2,
        }}
      >
        {/* Back of the card (hidden face) */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            bgcolor: "#0f172a", // dark bluish gray for glow contrast
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 2px 6px rgba(0,255,255,0.4)",
          }}
        >
          <HelpOutlineIcon
            sx={{
              fontSize: { xs: 30, sm: 40, md: 50, lg: 60 },
              color: "#00e5ff",
              filter: "drop-shadow(0 0 6px #00e5ff)",
            }}
          />
        </Box>

        {/* Front of the card (revealed face) */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            bgcolor: "#ffffff",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 10px rgba(0,0,0,0.4)",
            fontSize: { xs: 20, sm: 30, md: 40, lg: 50 },
          }}
        >
          {card.iconComponent}
        </Box>
      </Box>
    </Box>
  );
}

export default Card;
