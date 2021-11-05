// IHTTPRequest is an interface that describes every http request in this application
export interface IHTTPRequest {
    method: string;
    path: string;
    query: {[key: string]: any};
    url: string;
    ip: string;
    body: {[key: string]: any};
    cookies: {[key: string]: any};
    headers: {[key: string]: any};
};