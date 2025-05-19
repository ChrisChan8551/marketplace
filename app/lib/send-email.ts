import { Resend } from 'resend';

interface EmailOptions {
  to: string[];
  subject: string;
  link: string;
}

export async function sendProductEmail({ to, subject, link }: EmailOptions) {
  // Initialize Resend inside the function for server safety
  const resend = new Resend(process.env.RESEND_API_KEY);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: sans-serif; margin: 0; padding: 0; background-color: white; }
        .container { margin: 0 auto; padding: 20px 0 48px; }
        .button { display: inline-block; background-color: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 20px 0; }
        .title { font-size: 24px; font-weight: 600; }
        .text { font-size: 16px; color: #4b5563; }
        .section { width: 100%; display: flex; justify-content: center; margin-top: 28px; }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="title">Hi,</p>
        <p class="text">Thank you for buying your product at Digital Marketplace</p>
        <div class="section">
          <a href="${link}" class="button">Your Download Link</a>
        </div>
        <p class="text">Best, <br/> Digital Marketplace Team</p>
      </div>
    </body>
    </html>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: "Digital Marketplace <onboarding@resend.dev>",
      to,
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error("Email error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
