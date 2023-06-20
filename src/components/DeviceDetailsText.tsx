import { Box, Typography } from "@mui/material";

interface DevicesDetailsTextProps {
  title: string;
  value: string;
}

const DevicesDetailsText = ({
  title,
  value,
}: DevicesDetailsTextProps): JSX.Element => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 0.5,
        width: "100%",
        wordBreak: "break-word",
        flexWrap: "wrap",
      }}
    >
      <Typography textAlign={"left"} fontWeight="bold" color={"black"}>
        {title}:&nbsp;
      </Typography>
      <Typography textAlign={"left"} color={"black"}>
        {value}
      </Typography>
    </Box>
  );
};

export default DevicesDetailsText;
