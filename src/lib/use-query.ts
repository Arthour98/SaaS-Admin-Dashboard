import axios from "axios";

export type QueryProps =
    {
        method: string,
        body?: Object,
        params?: Object
    }

export const useQuery = async (url: string, payload: QueryProps) => {
    try {
        if (payload.method !== "get") {
            const res = await axios("/api/" + url,
                {
                    method: payload.method,
                    data: payload.body,
                    withCredentials: true
                },
            );
            return res.data;
        }
        else {
            const res = await axios("/api/" + url,
                {
                    method: payload.method,
                    params: payload.params,
                    withCredentials: true
                },
            );
            return res.data;
        }
    }
    catch (e) {
        console.error(e);
        throw e;
    }
}