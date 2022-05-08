import { useQuery, UseQueryResult } from "react-query";
import { fetcher } from "api/fetcher";
import { CycleObject, Failure } from "typings";

/**
 * @description GET /cycles
 * @returns {UseQueryResult<CycleObject>} the current cycle
 * @throws if fails
 */
export const useGetCurrentCycle = (): UseQueryResult<CycleObject> => {
    return useQuery('getCurrentCycle', async () => {
        const { data, status } = await fetcher.get<CycleObject | Failure>('/cycles');
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as CycleObject);
    });
};

/**
 * @description GET /cycles/:cycleId
 * @param {string} cycleId 
 * @returns {UseQueryResult<CycleObject>} the requested cycle
 * @throws if fails
 */
export const useGetCycle = (cycleId: string): UseQueryResult<CycleObject> => {
    return useQuery('getCycle', async () => {
        const { data, status } = await fetcher.get<CycleObject | Failure>(`/cycles/${cycleId}`);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as CycleObject);
    });
};

/**
 * @description GET /cycles/all
 * @returns {UseQueryResult<CycleObject} all the user's cycles
 * @throws if fails
 */
export const useGetAllCycles = (): UseQueryResult<Array<CycleObject>> => {
    return useQuery('getAllCycles', async () => {
        const { data, status } = await fetcher.get<Array<CycleObject> | Failure>('/cycles/all');
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as Array<CycleObject>);
    });
};

/**
 * @description POST /cycles
 * @returns {UseQueryResult<CycleObject>} the newly created cycle
 * @throws if fails
 */
export const useCreateCycle = (): UseQueryResult<CycleObject> => {
    return useQuery('createCycle', async () => {
        const { data, status } = await fetcher.post<CycleObject | Failure>('/cycles');
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as CycleObject);
    });
};

/**
 * @description POST /cycles/finish
 * @returns {UseQueryResult<CycleObject>} the finished cycle
 * @throws if fails
 */
export const useFinishCycles = (): UseQueryResult<CycleObject> => {
    return useQuery('finishCycle', async () => {
        const { data, status } = await fetcher.post<CycleObject | Failure>('/cycles/finish');
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as CycleObject);
    });
};