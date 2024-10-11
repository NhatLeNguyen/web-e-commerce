import React from "react";
import { useTheme, Theme } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import getColors from "../utils/GetColors";

interface DotProps extends BoxProps {
  color?: string;
  size?: number;
  variant?: "outlined" | "filled";
}

const Dot: React.FC<DotProps> = ({
  color = "primary",
  size = 8,
  variant = "filled",
  sx,
}) => {
  const theme = useTheme<Theme>();
  const colors = getColors(theme, color);
  const { main } = colors;

  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "50%",
        bgcolor: variant === "outlined" ? "transparent" : main,
        ...(variant === "outlined" && { border: `1px solid ${main}` }),
        ...sx,
      }}
    />
  );
};

export default Dot;
