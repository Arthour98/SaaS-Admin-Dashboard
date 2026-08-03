import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);

export default async function sendPasswordChangeEmail(email: string, userName: string) {
    const { data, error } = await resend.emails.send({
        from: "C-BOARD <onboarding@resend.dev>",
        to: [email],
        subject: "Your password was changed",
        html: `
        <h2>Hi ${userName}</h2>
        <p>Your account password has been changed successfully.</p>
        <p>If you did not make this change, please contact support immediately.</p>
        `,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
