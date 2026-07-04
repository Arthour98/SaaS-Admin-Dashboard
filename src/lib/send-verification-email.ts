import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-templates/verification_template";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string
) {
    const { data, error } = await resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: [email],
        subject: "Verify your email",
        react: EmailTemplate({ firstName, verificationToken }),
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}