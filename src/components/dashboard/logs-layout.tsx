"use client";

import { useCallback, useEffect, useState } from "react";
import styles from "@/components/main.module.css";
import { useQuery } from "@/lib/use-query";

export type LogItem = {
    id: number;
    user_id: number;
    user_name: string;
    action: string;
    type: "info" | "create" | "delete" | "update" | "warning";
    created_at: string;
};

export type LogsLayoutProps = {
    current_layout: boolean;
    organization_id: number;
    searchValue: string;
};

export default function LogsLayout({ current_layout, organization_id, searchValue }: LogsLayoutProps) {
    const [logs, setLogs] = useState<LogItem[]>([]);

    useEffect(() => {
        if (!current_layout) {
            return;
        }

        const fetchLogs = async () => {
            try {
                const result = await useQuery("dashboard/logs", {
                    method: "get",
                    params: { organization_id }
                });
                setLogs(result?.data?.logs || []);
            }
            catch (e) {
                console.error(e);
            }

        };

        fetchLogs();
    }, [current_layout, organization_id]);

    const filteredLogs = logs.filter((log) => {
        const search = searchValue.toLowerCase();
        return [log.user_name, log.action, log.type].some((value) => value?.toLowerCase().includes(search));
    });

    if (!current_layout) {
        return null;
    }

const logClassSelector = (type: string) => {
    switch (type) {
        case "info":
            return styles.log_info;

        case "create":
            return styles.log_create;

        case "delete":
            return styles.log_delete;

        case "update":
            return styles.log_update;

        case "warning":
            return styles.log_warning;

        default:
            return "";
    }
};

return (
<div className={styles.logsLayout}>
    {
    filteredLogs.length === 0 ? 
    (
    <div className={styles.notFound}>
        <p>No logs found</p>
    </div>
    ) 
    : 
    (
    <div className={styles.logsContainer}>
        {filteredLogs.map((log) => (
            <div key={log.id} 
            className={`${styles.logRow} ${logClassSelector(log?.type)}`}
            >
                <div className={styles.logActionCol}>
                    <p className="font-semibold">Log:</p>
                    <p className={styles.actionText}>{log.action}</p>
                </div>
                <div className={styles.logTypeCol}>
                    <p className="font-semibold">Type:</p>
                    <p>{log.type}</p>
                </div>
                <div className={styles.logDateCol}>
                    <p>{new Date(log.created_at).toLocaleString()}</p>
                </div>
            </div>
        ))}
    </div>
    )}
</div>
);
}
