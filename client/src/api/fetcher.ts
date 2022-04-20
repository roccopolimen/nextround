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

class Fetcher {
    private instance: AxiosInstance | null = null;

    private get http(): AxiosInstance {
        return this.instance !== null ? this.instance : this.initFetcher();
    }

    initFetcher() {
        const http = axios.create({
            baseURL: "http://localhost:4000",
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

    post<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.post<T, R>(url, data, config);
    }

    put<T = any, R = AxiosResponse<T>>(
        url: string,
        data?: T,
        config?: AxiosRequestConfig
    ): Promise<R> {
        return this.http.put<T, R>(url, data, config);
    }

    delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.http.delete<T, R>(url, config);
    }

    private handleError(error: any) {
        return Promise.reject(error);
    }
}

export const fetcher = new Fetcher();