import React, { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="text.secondary">
          {title}
        </Typography>
        <Grid container alignItems="center">
          <Grid item>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 40,
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: `${color}.main`,
                    borderRadius: "50%",
                    animation: "pulse 1.5s infinite",
                    animationDelay: "0s",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.3 },
                      "100%": { opacity: 1 },
                    },
                  }}
                />
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: `${color}.main`,
                    borderRadius: "50%",
                    animation: "pulse 1.5s infinite",
                    animationDelay: "0.3s",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.3 },
                      "100%": { opacity: 1 },
                    },
                  }}
                />
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: `${color}.main`,
                    borderRadius: "50%",
                    animation: "pulse 1.5s infinite",
                    animationDelay: "0.6s",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.3 },
                      "100%": { opacity: 1 },
                    },
                  }}
                />
              </Box>
            ) : (
              <Typography variant="h4" color="inherit">
                {count}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Stack>
      <Box sx={{ pt: 2.25 }}>
        <Typography variant="caption" color="text.secondary">
          You made an extra{" "}
          {loading ? (
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                verticalAlign: "middle",
                gap: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  backgroundColor: `${color}.main`,
                  borderRadius: "50%",
                  animation: "pulse 1.5s infinite",
                  animationDelay: "0s",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  backgroundColor: `${color}.main`,
                  borderRadius: "50%",
                  animation: "pulse 1.5s infinite",
                  animationDelay: "0.3s",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  backgroundColor: `${color}.main`,
                  borderRadius: "50%",
                  animation: "pulse 1.5s infinite",
                  animationDelay: "0.6s",
                  "@keyframes pulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.3 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
            </Box>
          ) : (
            <Typography variant="caption" sx={{ color: `${color}.main` }}>
              {extra}
            </Typography>
          )}{" "}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatisticsCard;
