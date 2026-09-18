import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_KEY);

export default async function sendVerificationEmail(
    email: string,
    firstName: string,
    verificationToken: string
) {

   
  
    const { data, error } = await resend.emails.send({
        from: "C-BOARD <no-reply@c-board.uk>",
        to: [email],
        subject: "Verify your email",
        html:`
        <h2>Hi ${firstName}</h2>
        <p>Your verification code:</p>
        <h1>${verificationToken}</h1>
        <p>This code will expire soon.</p>
        `
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}