"use server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ZodStringDef, z } from "zod";
import prisma from "./lib/db";
import { type CategoryTypes } from "@prisma/client";
// import { stripe } from "./lib/stripe";
import { redirect } from "next/navigation";

export type State = {
    status: "error" | "success" | undefined;
    errors?: {
        [key: string]: string[];
    };
    message?: string | null;
};

const productSchema = z.object({
    name: z
        .string()
        .min(3, { message: "The name has to be a min character length of 3" }),
    category: z.string().min(1, { message: "Category is required" }),
    price: z.number().min(1, { message: "The Price has to be bigger then 1" }),
    smallDescription: z
        .string()
        .min(10, { message: "Minimum 10 characters required" }),
    description: z.string().min(10, { message: "Minimum 10 characters required" }),
    images: z.array(z.string(), { message: "Images are required" }),
    productFile: z
        .string()
        .min(1, { message: "Please upload a zip of your product" }),
});

export async function SellProduct(prevState: any, formData: FormData) {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
        throw new Error("user not found");
    }
    const validateFields = productSchema.safeParse({
        name: formData.get("name"),
        category: formData.get("category"),
        price: Number(formData.get("price")), // convert string to number for validation
        smallDescription: formData.get("smallDescription"),
        description: formData.get("description"),
        images: JSON.parse(formData.get("images") as string), //images are in an array of strings. need to add JSON.parse
        productFile: formData.get("productFile"),
    });

    if (!validateFields.success) {
        const state: State = {
            status: "error",
            errors: validateFields.error.flatten().fieldErrors,
            message: "Invalid input data in fields",
        };

        return state;
    }

    const data = await prisma.product.create({
        data: {
            name: validateFields.data.name,
            category: validateFields.data.category as CategoryTypes,
            smallDescription: validateFields.data.smallDescription,
            price: validateFields.data.price,
            images: validateFields.data.images,
            productFile: validateFields.data.productFile,
            userId: user.id,
            description: JSON.parse(validateFields.data.description),
        },
    });

    const state: State = {
        status: "success",
        message: "Your Product has been created",
    };

    return state;

}

