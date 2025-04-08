import React from "react";
import IconButton from "@mui/material/IconButton";
import { useColorMode } from "./AuthTheme";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const ColorModeSelect: React.FC = (props) => {
  const colorMode = useColorMode() as {
    mode: "light" | "dark";
    toggleColorMode: () => void;
  };
  return (
    <IconButton onClick={colorMode.toggleColorMode} {...props}>
      {colorMode.mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
    </IconButton>
  );
};

export default ColorModeSelect;
