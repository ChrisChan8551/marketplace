// Remove React email components completely
// import { renderAsync } from "@react-email/components";
// import ProductEmail from "@/app/components/ProductEmail";

export function generateProductEmail(link: string) {
    // Simple HTML template string instead of React components
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Your Product from Digital Marketplace</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2>Your product is here!</h2>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for buying your product at Digital Marketplace</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Your Download Link</a>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">Best,<br>Digital Marketplace Team</p>
        </div>
    </body>
    </html>
    `;
}
