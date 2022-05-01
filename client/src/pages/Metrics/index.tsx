import { 
    Box,
    Card,
    CardContent,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery
} from "@mui/material";
import { useEffect, useState } from "react";
import { 
    CartesianGrid,
    Funnel,
    FunnelChart, 
    LabelList, 
    Legend, 
    Line, 
    LineChart, 
    Tooltip, 
    XAxis, 
    YAxis
} from "recharts";
import { ApplicationObject, MetricsObject } from "typings";

export default function Metrics() {
    // State variables
    const [applications, setApplications] = useState([] as ApplicationObject[]);
    const [data, setData] = useState(undefined as MetricsObject | undefined);
    const [funnelData, setFunnelData] = useState([] as any[]);
    const [lineData, setLineData] = useState([] as any[]);

    // Responsive design
    const mobile: boolean = useMediaQuery('(max-width: 900px)');

    useEffect(() => {
        // Fetch data
        const dummyData: MetricsObject = {
            num_saved: 20,
            num_applications: 17,
            num_interviewed: 13,
            num_offers: 4,
            // Other metrics
            num_rejections: 4,
            num_rounds: 32,
            avg_salary: 120000,
            num_connections: 8,
            application_timeline: [
                new Date("2021/08/05"),
                new Date("2021/08/11"),
                new Date("2021/08/11"),
                new Date("2021/08/12"),
                new Date("2021/08/12"),
                new Date("2021/08/19"),
                new Date("2021/08/20"),
                new Date("2021/08/20"),
                new Date("2021/08/20"),
                new Date("2021/08/20"),
                new Date("2021/08/20"),
                new Date("2021/08/26"),
                new Date("2021/08/29"),
                new Date("2021/09/01"),
                new Date("2021/09/02"),
                new Date("2021/09/03"),
                new Date("2021/09/04"),
                new Date("2021/09/04"),
                new Date("2021/09/05"),
                new Date("2021/09/09")
            ]
        };
        setData(dummyData);
        setApplications([{
            _id: 1,
            position: "Software Engineer",
            company: "Google",
            location: "Mountain View, CA",
            salary: 120000,
            cardColor: "#00bcd4",
            progress: 1,
            jobPostUrl: "https://www.google.com",
            description: "Blah blah blah",
            notes: [],
            events: [],
            contacts: []
        }]);
    }, []);

    useEffect(() => {
        // Create funnel data
        if (data) {
            const funnelData: any[] = [
                {
                    name: "Saved",
                    value: data.num_saved,
                    fill: "#6c50ed",
                },
                {
                    name: "Applied",
                    value: data.num_applications,
                    fill: "#614eba",
                },
                {
                    name: "Interviewed",
                    value: data.num_interviewed,
                    fill: "#6e5eba",
                },
                {
                    name: "Offers",
                    value: data.num_offers,
                    fill: "#8377ba",
                }
            ];
            setFunnelData(funnelData);

            // Create line chart data
            let lineData: any[] = [];
            let count: number = 1;
            let n: number = data.application_timeline.length;
            for(let d: Date = data.application_timeline[0];
                d <= data.application_timeline[n-1];
                d.setDate(d.getDate() + 1)) {
                let dt: Date = new Date(d);
                count += data.application_timeline.filter(
                    x => x.getTime() === dt.getTime()).length-1;
                lineData.push({
                    name: dt.toLocaleDateString(),
                    apps: count
                });
            }
            setLineData(lineData);
        }
    }, [data]);

    if(!data) {
        return <div>Loading...</div>;
    } else {
        return (
            <Box sx={{ bgcolor: '#F9F8FF', pb: 3}}>
                <Typography variant="h1"
                    sx={{ mb: 5, ml: 5, mt: 2, fontSize: '36pt' }}>
                    Metrics
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }} 
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    sx={{ mx: 50 }}>

                    {/* Application Funnel */}
                    <Grid item>
                        <Card sx={{ ml: 3 }}>
                            <CardContent>
                                <Typography variant="h2"
                                    sx={{ mb: 2, fontSize: '24pt',
                                    borderBottom: 'solid #ADA7BD 0.5px' }}>
                                    Application Funnel
                                </Typography>
                                <FunnelChart width={550} height={150}>
                                    <Tooltip />
                                    <Funnel
                                        dataKey="value"
                                        data={funnelData}
                                        isAnimationActive
                                    >
                                        <LabelList position="centerBottom"
                                            fill="#000" stroke="none"
                                            dataKey="value" />
                                        <LabelList position="right" fill="#000"
                                             stroke="none" dataKey="name" />
                                    </Funnel>
                                </FunnelChart>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Fun Stats Card */}
                    <Grid item>
                        <Card sx={{ ml: 3 }}>
                            <CardContent>
                                <Typography variant="h2"
                                    sx={{ mb: 2, fontSize: '24pt',
                                    borderBottom: 'solid #ADA7BD 0.5px' }}>
                                    Fun Stats
                                </Typography>
                                <Grid container spacing={{ xs: 2, md: 3 }} 
                                    columns={{ xs: 1, sm: 2, md: 2 }} >
                                    <Grid item>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h3"
                                                    display="inline"
                                                    sx={{ fontSize: '18pt',
                                                    fontWeight: 'bold' }}>
                                                    {data.num_rounds}
                                                </Typography>
                                                <Typography variant="h4"
                                                    sx={{ fontSize: '14pt' }}>
                                                    interview rounds
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h3"
                                                    display="inline"
                                                    sx={{ fontSize: '18pt',
                                                    fontWeight: 'bold' }}>
                                                    {data.num_connections}
                                                </Typography>
                                                <Typography variant="h4"
                                                    sx={{ fontSize: '14pt' }}>
                                                    connections
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h3"
                                                    display="inline"
                                                    sx={{ fontSize: '18pt',
                                                    fontWeight: 'bold' }}>
                                                    ${data.avg_salary}
                                                </Typography>
                                                <Typography variant="h4"
                                                    sx={{ fontSize: '14pt' }}>
                                                    average salary
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                                </CardContent>
                        </Card>
                    </Grid>

                    {/* Application Timeline */}
                    <Grid item>
                        <Card sx={{ ml: 3 }}>
                            <CardContent>
                                <Typography variant="h2"
                                    sx={{ mb: 2, fontSize: '24pt',
                                    borderBottom: 'solid #ADA7BD 0.5px' }}>
                                    Application Timeline
                                </Typography>
                                <LineChart width={750} height={250}
                                    data={lineData}
                                    margin={{ top: 5, right: 30, left: 20,
                                     bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" minTickGap={10} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="apps"
                                        stroke="#8884d8" />
                                </LineChart>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* TODO: Table of applications */}
                    <TableContainer component={Paper}
                        sx={{ width: '75%', margin: 'auto', mt: 5, mb: 3 }}>
                        <Table aria-label="job table">
                            <TableHead>
                            <TableRow>
                                <TableCell>Role</TableCell>
                                <TableCell align="right">Company</TableCell>
                                <TableCell align="right">Status</TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {applications.map((app) => (
                                <TableRow
                                    key={app._id}
                                    sx={{ '&:last-child td, &:last-child th': {
                                         border: 0 } }} >
                                <TableCell component="th" scope="row">
                                    {app.position}
                                </TableCell>
                                <TableCell align="right">
                                    {app.company}
                                </TableCell>
                                <TableCell align="right">
                                    {app.progress === 1 ? "Accepted" : 
                                    (app.progress === 2 ? "Rejected" :
                                     "Pending")}
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </TableContainer>
                </Grid>
            </Box>
        );
    }
};