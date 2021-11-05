// IHTTPResponse is an interface that describes every http response for this application
export interface IHTTPResponse {
    setCookie(key: string, value: string, options: {
        expires: number;
        httpOnly: boolean;
        secure: boolean;
    }): void;
    setHeader(key: string, value: string): void;
    do<T>(statusCode: number, body: T): void;
};