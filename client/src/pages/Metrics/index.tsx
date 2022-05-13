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
    Typography
} from "@mui/material";
import { useGetCurrentCycle, useGetCycle, useGetCycleMetrics, useGetMetrics } from "api";
import StatCard from "components/StatCard";
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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
import Loading from 'components/Loading';
import SideDrawer from "components/SideDrawer";

export default function Metrics() {
    const navigate = useNavigate();
    const params = useParams();
    const cycleId = params.cycleId;
    // State variables
    const [applications, setApplications] = useState([] as ApplicationObject[]);
    const [data, setData] = useState(undefined as MetricsObject | undefined);
    const [funnelData, setFunnelData] = useState([] as any[]);
    const [lineData, setLineData] = useState([] as any[]);

    // Queries
    const { data: cMetricsData, isLoading: cIsLoading, isError: cIsError,
         refetch: fetchCurrentMetrics } = useGetMetrics();
    const { data: metricsData, isLoading, isError,
         refetch: fetchMetrics } = useGetCycleMetrics(cycleId ? cycleId : "");
    const {data: cCycleData, isLoading: cCycleIsLoading, isError: cCycleIsError,
         refetch: fetchCurrentCycle} = useGetCurrentCycle();
    const {data: cycleData, isLoading: cycleIsLoading, isError: cycleIsError,
         refetch: fetchCycle} = useGetCycle(cycleId ? cycleId : "");

    useEffect(() => {
        // Fetch data on mount
        const fetchData = async () => {
            if (cycleId) {
                await fetchCycle();
                await fetchMetrics();
            } else {
                try {
                    await fetchCurrentCycle({ throwOnError: true });
                    await fetchCurrentMetrics();
                } catch(e) {
                    navigate('/create');
                }
            }
        };
        fetchData();
    }, [cycleId, fetchCurrentCycle, fetchCycle, fetchMetrics,
         fetchCurrentMetrics]);

    useEffect(() => {
        // Set data when successfully retrieved
        if (metricsData && cycleId) {
            setData(metricsData);
        } else if(cMetricsData && !cycleId) {
            setData(cMetricsData);
        }

        if (cycleData && cycleId) {
            setApplications(cycleData.applications);
        } else if (cCycleData && !cycleId) {
            setApplications(cCycleData.applications);
        }
    }, [cMetricsData, metricsData, cCycleData, cycleData, cycleId]);

    useEffect(() => {
        // Create funnel data
        if (data) {
            const funnelData: any[] = [];
            if(data.num_saved > 0) {
                funnelData.push({
                    name: "Saved",
                    value: data.num_saved,
                    fill: "#6c50ed"
                });
                if(data.num_applications > 0) {
                    funnelData.push({
                        name: "Applied",
                        value: data.num_applications,
                        fill: "#765fde"
                    });
                    if(data.num_interviewed > 0) {
                        funnelData.push({
                            name: "Interviewed",
                            value: data.num_interviewed,
                            fill: "#7d6ccc"
                        });
                        if(data.num_offers > 0) {
                            funnelData.push({
                                name: "Offers",
                                value: data.num_offers,
                                fill: "#8377ba"
                            });
                        }
                    }
                }
            }
            setFunnelData(funnelData);

            // Create line chart data
            let lineData: any[] = [];
            let count: number = 0;
            let n: number = data.application_timeline.length;
            for(let d: Date = new Date(data.application_timeline[0]);
                d <= new Date(data.application_timeline[n-1]);
                d.setDate(d.getDate() + 1)) {
                let dt: Date = new Date(d);
                count += data.application_timeline.filter(
                    x => new Date(x).getTime() === dt.getTime()).length;
                lineData.push({
                    name: dt.toLocaleDateString(),
                    apps: count
                });
            }
            setLineData(lineData);
        }
    }, [data]);

    if(isLoading || cIsLoading || cycleIsLoading || cCycleIsLoading) {
        return (
            <div>
                <Loading open={ true } />
            </div>
        );
    } else if(!data || isError || cIsError || cycleIsError || cCycleIsError) {
        return (
            <div>
                <SideDrawer />
                <Typography variant="h1">
                    Error retrieving metrics details.
                </Typography>
            </div>
        );
    } else {
        return (
            <Box sx={{ mb: 3}}>
                <SideDrawer />
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
                                        <LabelList position="inside"
                                            fill="#000" stroke="none"
                                            dataKey="name" />
                                        <LabelList position="right" fill="#000"
                                             stroke="none" dataKey="value" />
                                    </Funnel>
                                </FunnelChart>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Fun Stats Card */}
                    <Grid item>
                        <StatCard data={data} />
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

                    {/* Table of applications */}
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
                                    {app.progress === 1 ? "Offered" : 
                                    (app.progress === 2 ? "Rejected" :
                                    app.progress === 3 ? "Waitlist" :
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