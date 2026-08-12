import { Box } from "@mui/material";

export default function Background() {
    return (
        <>
            <Box
                sx={{
                    position: "fixed",
                    top: -120,
                    left: -120,
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.08)",
                    filter: "blur(10px)",
                }}
            />

            <Box
                sx={{
                    position: "fixed",
                    bottom: -180,
                    right: -180,
                    width: 500,
                    height: 500,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,.06)",
                    filter: "blur(10px)",
                }}
            />
        </>
    );
}