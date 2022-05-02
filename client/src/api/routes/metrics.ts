import { useQuery, UseQueryResult } from "react-query";
import { fetcher } from "api/fetcher";
import { Failure, MetricsObject } from "typings";

/**
 * @description GET /metrics
 * @returns {UseQueryResult<MetricsObject>} the requested metrics
 * @throws if fails
 */
export const useGetMetrics = (): UseQueryResult<MetricsObject> => {
    return useQuery('getMetrics', async () => {
        const { data, status } = await fetcher.get<MetricsObject | Failure>('/metrics');
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as MetricsObject);
    });
};

/**
 * @description GET /metrics/:cycleId
 * @param {string} cycleId 
 * @returns {UseQueryResult<MetricsObject>} the requested metrics from the cycle
 * @throws if fails
 */
export const useGetCycleMetrics = (cycleId: string): UseQueryResult<MetricsObject> => {
    return useQuery('getCycleMetrics', async () => {
        const { data, status } = await fetcher.get<MetricsObject | Failure>(`/metrics/${cycleId}`);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as MetricsObject);
    });
};
