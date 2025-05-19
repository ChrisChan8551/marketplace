import { renderAsync } from "@react-email/components";
import ProductEmail from "@/app/components/ProductEmail";

export async function generateProductEmail(link: string) {
    try {
        return await renderAsync(ProductEmail({ link }));
    } catch (error) {
        console.error("Error generating email:", error);
        // Return a simple fallback HTML if rendering fails
        return `<div>Your product download link: <a href="${link}">${link}</a></div>`;
    }
}
