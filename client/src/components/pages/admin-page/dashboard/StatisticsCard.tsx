import React from "react";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

interface StatisticsCardProps {
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  title: string;
  count: string;
  percentage?: number;
  isLoss?: boolean;
  extra: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({
  color = "primary",
  title,
  count,
  extra,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            <Typography variant="h4" color="inherit">
              {count}
            </Typography>
          </Grid>
        </Grid>
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="text.secondary">
          You made an extra{" "}
          <Typography variant="caption" sx={{ color: `${color}.main` }}>
            {extra}
          </Typography>{" "}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatisticsCard;
