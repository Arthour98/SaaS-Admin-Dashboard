import * as React from 'react';

interface EmailTemplateProps {
  firstName: string;
  verificationToken:string,
}

export function EmailTemplate({ firstName,verificationToken }: EmailTemplateProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
      <section className="verificationCode">
      <p>This is your verification code :</p>
      <p>{verificationToken}</p>
      </section>
    </div>
  );
}