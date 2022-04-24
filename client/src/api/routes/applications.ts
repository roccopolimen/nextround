import { useQuery, UseQueryResult } from "react-query";
import { fetcher } from "api/fetcher";
import { ApplicationObject, ContactObject, EventObject, Failure } from "typings";
import { AxiosResponse } from "axios";

/**
 * @description GET /application/:applicationId
 * @param {string} applicationId 
 * @returns {UseQueryResult<ApplicationObject>} the requested application
 * @throws if fails
 */
export const useGetApplication = (applicationId: string): UseQueryResult<ApplicationObject> => {
    return useQuery('getApplication', async () => {
        const { data, status } = await fetcher.get<ApplicationObject | Failure>(`/application/${applicationId}`);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as ApplicationObject);
    });
};

/**
 * @description GET /application/:cycleId/:applicationId
 * @param {string} cycleId 
 * @param {string} applicationId 
 * @returns {UseQueryResult<ApplicationObject>} the requested application
 * @throws if fails
 */
export const useGetApplicationFromCycle = (cycleId: string, applicationId: string): UseQueryResult<ApplicationObject> => {
    return useQuery('getApplicationFromCycle', async () => {
        const { data, status } = await fetcher.get<ApplicationObject | Failure>(`/application/${cycleId}/${applicationId}`);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as ApplicationObject);
    });
};

/**
 * @description POST /application
 * @param {string} company 
 * @param {string} position 
 * @param {string} location 
 * @param  {string} jobPostUrl 
 * @param {string} description 
 * @returns {UseQueryResult<ApplicationObject>} the newly created application
 * @throws if fails
 */
export const useCreateApplication = (company: string, position: string, location: string, jobPostUrl: string, description: string): UseQueryResult<ApplicationObject> => {
    return useQuery('createApplication', async () => {
        const body: Partial<ApplicationObject> = {
            company,
            position,
            location,
            jobPostUrl,
            description
        };
        const { data, status } = await fetcher.post<Partial<ApplicationObject>, AxiosResponse<ApplicationObject | Failure>>('/application', body);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as ApplicationObject);
    });
};

/**
 * @description POST /application/event/:applicationId
 * @param {string} applicationId 
 * @param {string} title 
 * @param {string} date 
 * @param {string} location 
 * @returns {UseQueryResult<EventObject>} the newly created event
 * @throws if fails
 */
export const useCreateEvent = (applicationId: string, title: string, date: string, location: string): UseQueryResult<EventObject> => {
    return useQuery('createEvent', async () => {
        const body: Partial<EventObject> = {
            title,
            date,
            location
        };
        const { data, status } = await fetcher.post<Partial<EventObject>, AxiosResponse<EventObject | Failure>>(`/application/event/${applicationId}`, body);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as EventObject);
    });
};

/**
 * @description POST /application/contact/:applicationId
 * @param {string} applicationId 
 * @param {string} name 
 * @param {string} pronouns 
 * @param {string} location 
 * @param {string} phone 
 * @param {string} email 
 * @returns {UseQueryResult<ContactObject>} the newly created contact
 * @throws if fails
 */
export const useCreateContact = (applicationId: string, name: string, pronouns: string, location: string, phone: string, email: string): UseQueryResult<ContactObject> => {
    return useQuery('createEvent', async () => {
        const body: Partial<ContactObject> = {
            name,
            pronouns,
            location,
            phone,
            email
        };
        const { data, status } = await fetcher.post<Partial<ContactObject>, AxiosResponse<ContactObject | Failure>>(`/application/contact/${applicationId}`, body);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as ContactObject);
    });
};

/**
 * @description PATCH /application/:applicationId
 * @param {string} applicationId 
 * @param {string} company 
 * @param {string} position 
 * @param {string} location 
 * @param {string} jobPostUrl 
 * @param {string} description 
 * @param {string} salary 
 * @param {string} cardColor 
 * @param {string} progress 
 * @returns {UseQueryResult<ApplicationObject>} the updated application
 * @throws if fails
 */
export const useUpdateApplication = (applicationId: string, company?: string, position?: string, location?: string, jobPostUrl?: string, description?: string, salary?: number, cardColor?: string, progress?: number): UseQueryResult<ApplicationObject> => {
    return useQuery('updateApplication', async () => {
        const body: Partial<ApplicationObject> = {
            company,
            position,
            location,
            jobPostUrl,
            description,
            salary,
            cardColor,
            progress
        };
        const { data, status } = await fetcher.patch<Partial<ApplicationObject>, AxiosResponse<ApplicationObject | Failure>>(`/application/${applicationId}`, body);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as ApplicationObject);
    });
};

/**
 * @description PATCH /application/event/:applicationId/:eventId
 * @param {string} applicationId 
 * @param {string} eventId 
 * @param {string} status 
 * @param {string} title 
 * @param {string} date 
 * @param {string} location 
 * @returns {UseQueryResult<EventObject>} the updated event
 * @throws if fails
 */
export const useUpdateEvent = (applicationId: string, eventId: string, status?: boolean, title?: string, date?: string, location?: string): UseQueryResult<EventObject> => {
    return useQuery('updateEvent', async () => {
        const body: Partial<EventObject> = {
            status,
            title,
            date,
            location
        };
        const { data, status:statusCode } = await fetcher.patch<Partial<EventObject>, AxiosResponse<EventObject | Failure>>(`/application/event/${applicationId}/${eventId}`, body);
        if(statusCode !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as EventObject);
    });
};

/**
 * @description PATCH /application/contact/:applicationID/:contactId
 * @param {string} applicationId 
 * @param {string} contactId 
 * @param {string} name 
 * @param {string} pronouns 
 * @param {string} location 
 * @param {string} phone 
 * @param {string} email 
 * @returns {UseQueryResult<ContactObject>} the updated contact
 * @throws if fails
 */
export const useUpdateContact = (applicationId: string, contactId: string, name?: string, pronouns?: string, location?: string, phone?: string, email?: string): UseQueryResult<ContactObject> => {
    return useQuery('updateContact', async () => {
        const body: Partial<ContactObject> = {
            name,
            pronouns,
            location,
            phone,
            email
        };
        const { data, status } = await fetcher.patch<Partial<ContactObject>, AxiosResponse<ContactObject | Failure>>(`/application/contact/${applicationId}/${contactId}`, body);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as ContactObject);
    });
};

/**
 * @description DELETE /application/:applicationId
 * @param {string} applicationId 
 * @returns {UseQueryResult<boolean>} true if successful
 * @throws if fails
 */
export const useDeleteApplication = (applicationId: string): UseQueryResult<boolean> => {
    return useQuery('deleteApplication', async () => {
        const { data, status } = await fetcher.delete<Failure>(`/application/${applicationId}`);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return true;
    });
};

/**
 * @description DELETE /application/event/:applicationID/:eventId
 * @param {string} applicationId 
 * @param {string} eventId 
 * @returns {UseQueryResult<boolean>} true if successful
 * @throws if fails
 */
export const useDeleteEvent = (applicationId: string, eventId: string): UseQueryResult<boolean> => {
    return useQuery('deleteEvent', async () => {
        const { data, status } = await fetcher.delete<Failure>(`/application/event/${applicationId}/${eventId}`);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return true;
    });
};

/**
 * @description DELETE /application/contact/:applicationId/:contactId
 * @param {string} applicationId 
 * @param {string} contactId 
 * @returns {UseQueryResult<boolean>} true if successful
 * @throws if fails
 */
export const useDeleteContact = (applicationId: string, contactId: string): UseQueryResult<boolean> => {
    return useQuery('deleteContact', async () => {
        const { data, status } = await fetcher.delete<Failure>(`/application/contact/${applicationId}/${contactId}`);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return true;
    });
};
