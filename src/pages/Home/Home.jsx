import DashboardLayout from "@/layouts/DashboardLayout";
import {Typography,Box} from "@mui/material";
import DashboardCard from "@/components/Card/DashboardCard";
import { dashboardData } from "@/data/dashboardData";

export default function Home() {

    return (

        <DashboardLayout>

            <Typography
                variant="h4"
                fontWeight={700}
                mb={4}
            >
                Bienvenido nuevamente
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gap: 3,
                    gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1fr",
                        lg: "repeat(4, 1fr)"
                    }
                }}
            >

                <DashboardCard
                    title="Libros"
                    value={dashboardData.libros}
                />

                <DashboardCard
                    title="Reservas"
                    value={dashboardData.reservas}
                />

                <DashboardCard
                    title="Categorías"
                    value={dashboardData.categorias}
                />

                <DashboardCard
                    title="Usuarios"
                    value={dashboardData.usuarios}
                />

            </Box>

        </DashboardLayout>

    );

}