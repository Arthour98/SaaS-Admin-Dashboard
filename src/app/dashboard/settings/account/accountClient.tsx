'use client'
import { useEffect, useState, type FormEvent } from "react";
import styles from "@/components/main.module.css";
import CustomButton from "@/components/elements/customButton";
import { useQuery } from "@/lib/use-query";
import { useToast } from "@/hooks/use-toast";

export default function AccountClient() {
const [userName, setUserName] = useState("");
const [email, setEmail] = useState("");
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [deletePassword, setDeletePassword] = useState("");

const [loading, setLoading] = useState(false);
const [deleteLoading, setDeleteLoading] = useState(false);

useEffect(() => {
    async function loadUser() {
        try {
            const result = await useQuery("auth/me", { method: "get" });
            setUserName(result.user?.name || "");
            setEmail(result.user?.email || "");
        } catch (e) {
            useToast({type:"error",message:"Could not load the user , try again !"})
        }
    }
    loadUser();
}, []);

const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
        const result = await useQuery("auth/update-account", {
            method: "patch",
            body: {
                user_name: userName,
                current_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmPassword,
            },
        });

        if (result.error) {
            useToast({type:"error",message:result.error})
            return;
        }
        useToast({type:"success",message:"Successfully updated account"})
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setLoading(false);
    } catch (e) {
        setLoading(false);
       useToast({type:"error",message:"Failed to update account"})
    }
};

const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!window.confirm("Delete your account? This cannot be undone.")) {
        return;
    }

    setDeleteLoading(true);
    try {
        const result = await useQuery("auth/delete-account", {
            method: "delete",
            body: { current_password: deletePassword },
        });

        if (result.error) {
            setDeleteLoading(false);
            return;
        }

        window.location.href = "/";
    } catch (e) {
        setDeleteLoading(false);
    }
};

return (
<div className={styles.dashboardContent}>
    <div className={styles.accountLayout}>
        <section className={styles.accountPanel}>
            <h3 className={styles.accountHeading}>Edit account</h3>
                <form onSubmit={handleUpdate} className={styles.accountForm}>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Username</label>
                        <input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className={styles.generalInput}
                            type="text"
                            placeholder="Your username"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            value={email}
                            readOnly
                            className={styles.generalInput}
                            type="email"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Current password</label>
                        <input
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={styles.generalInput}
                            type="password"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>New password</label>
                        <input
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={styles.generalInput}
                            type="password"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Confirm new password</label>
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={styles.generalInput}
                            type="password"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <div className={styles.formActions}>
                        <CustomButton element="button" content={"Save changes"} className={styles.submitButton} disabled={loading} />
                    </div>
                </form>
            </section>
            <section className={styles.accountPanel}>
                <h3 className={styles.accountHeading}>Delete account</h3>
                <p className={styles.accountCopy}>Deleting your account is permanent. Your data and organization memberships will be removed.</p>
                <form onSubmit={handleDelete} className={styles.accountForm}>
                    <div className={styles.formRow}>
                        <label className={styles.formLabel}>Confirm current password</label>
                        <input
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className={styles.generalInput}
                            type="password"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div className={styles.formActions}>
                        <CustomButton element="button" content={"Delete account"} className={styles.deleteButton} disabled={deleteLoading} />
                    </div>
                </form>
            </section>
        </div>
    </div>
);
}
