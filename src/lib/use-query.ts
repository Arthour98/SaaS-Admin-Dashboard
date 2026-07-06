import axios from "axios";

export type QueryProps =
    {
        method: string,
        body: Object,
    }

export const useQuery = async (url: string, payload: QueryProps) => {
    try {
        const res = await axios("/api/" + url,
            {
                method: payload.method,
                data: payload.body,
                withCredentials: true
            },
        );
        return res.data;
    }
    catch (e) {
        console.error(e);
        throw e;
    }
}