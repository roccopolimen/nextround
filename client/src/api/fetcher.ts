import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import firebase from 'firebase/compat/app';

const headers: Readonly<Record<string, string | boolean>> = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Credentials": true,
    "X-Requested-With": "XMLHttpRequest",
};

const injectToken = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    try {
        const token: string = await firebase.auth().currentUser?.getIdToken(true)!;
        if(token !== null && config.headers !== undefined)
            config.headers.Authorization = `JWT ${token}`;
    } catch(e) {
        console.log(e);
    }
    return config;
};

// ref (https://stackoverflow.com/questions/69417883/axios-post-request-with-typescript-issue)
class Fetcher {
    private instance: AxiosInstance | null = null;

    private get http(): AxiosInstance {
        return this.instance !== null ? this.instance : this.initFetcher();
    }

    initFetcher() {
        const http = axios.create({
            baseURL: process.env.REACT_APP_SERVER_URL,
            headers,
            withCredentials: true,
        });

        http.interceptors.request.use(injectToken, (error) => Promise.reject(error));
        http.interceptors.response.use(
            (response) => response,
            (error) => {
                const { response } = error;
                return this.handleError(response);
            }
        );

        this.instance = http;
        return http;
    }

    request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R> {
        return this.http.request(config);
    }

    get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.http.get<T, R>(url, config);
    }

    post<T = never, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.post<T, R>(url, data, config);
    }

    patch<T = never, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.patch<T, R>(url, data, config);
    }

    delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.http.delete<T, R>(url, config);
    }

    private handleError(error: any) {
        return Promise.reject(error);
    }
}

export const fetcher = new Fetcher();