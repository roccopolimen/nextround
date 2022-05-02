import { useQuery, UseQueryResult } from "react-query";
import { fetcher } from "api/fetcher";
import { ApplicationObject, Failure } from "typings";

/**
 * @description GET /offers
 * @returns {UseQueryResult<Array<ApplicationObject>>} the current cycle's offers
 * @throws if fails
 */
export const useGetOffers = (): UseQueryResult<Array<ApplicationObject>> => {
    return useQuery('getOffers', async () => {
        const { data, status } = await fetcher.get<Array<ApplicationObject> | Failure>('/offers');
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as Array<ApplicationObject>);
    });
};
