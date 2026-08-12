import PropTypes from "prop-types";

import {
    Card,
    CardContent,
    Typography
} from "@mui/material";

export default function DashboardCard({
    title,
    value
}) {

    return (

        <Card>

            <CardContent>

                <Typography
                    color="text.secondary"
                >
                    {title}
                </Typography>

                <Typography
                    variant="h4"
                    fontWeight={700}
                >
                    {value}
                </Typography>

            </CardContent>

        </Card>

    );

}

DashboardCard.propTypes = {
    title: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};