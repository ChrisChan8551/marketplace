import React from "react";

export interface EmailProps {
  link: string;
}

export function renderToHtml(props: EmailProps): string {
  const { link } = props;

  return `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .text {
            font-size: 16px;
            line-height: 1.5;
            color: #666;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin: 20px 0;
          }
          .button-container {
            text-align: center;
            margin: 30px 0;
          }
          .link-box {
            background-color: #f3f4f6;
            padding: 10px;
            border-radius: 4px;
            word-break: break-all;
            margin: 20px 0;
          }
          .signature {
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="title">Hi there,</h2>
          <p class="text">
            Thank you for your purchase from Digital Marketplace!
          </p>
          <div class="button-container">
            <a href="${link}" class="button">
              Download Your Product
            </a>
          </div>
          <p class="text">
            If the button above doesn't work, copy and paste this link into your browser:
          </p>
          <p class="link-box">
            ${link}
          </p>
          <p class="text signature">
            Best regards,<br />
            Digital Marketplace Team
          </p>
        </div>
      </body>
    </html>
  `;
}

export default function SimpleProductEmail({ link }: EmailProps) {
  return <div dangerouslySetInnerHTML={{ __html: renderToHtml({ link }) }} />;
}
