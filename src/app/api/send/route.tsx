import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-templates/verification_template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(firstName:string,verificationToken:string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello world',
      react: EmailTemplate({firstName,verificationToken}),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}