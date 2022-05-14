import { Card, CardContent, Grid, Typography } from "@mui/material";
import { MetricsObject } from "typings";

interface PropType {
    data: MetricsObject
};

const StatCard = (props: PropType): JSX.Element => {
    return (
        <Card sx={{ ml: 3 }}>
            <CardContent>
                <Typography variant="h2" sx={{ mb: 2, fontSize: '24pt', borderBottom: 'solid #ADA7BD 0.5px' }}>
                    Fun Stats
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 2 }} >
                    <Grid item>
                        <Card>
                            <CardContent>
                                <Typography 
                                    variant="h3"
                                    display="inline"
                                    sx={{
                                        fontSize: '18pt',
                                        fontWeight: 'bold'
                                    }}
                                >{props.data.num_rounds}</Typography>
                                <Typography variant="h4" sx={{ fontSize: '14pt' }}>
                                    interview rounds
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="h3"
                                    display="inline"
                                    sx={{
                                        fontSize: '18pt',
                                        fontWeight: 'bold'
                                    }}
                                >{props.data.num_connections}</Typography>
                                <Typography variant="h4" sx={{ fontSize: '14pt' }}>
                                    connections
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant="h3"
                                    display="inline"
                                    sx={{
                                        fontSize: '18pt',
                                        fontWeight: 'bold'
                                    }}
                                >${props.data.avg_salary}</Typography>
                                <Typography variant="h4" sx={{ fontSize: '14pt' }}>
                                    average salary
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default StatCard;