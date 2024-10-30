import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({
        message:"Email required"
    }),
    password: z.string().min(1, {
        message:"Password required"
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message:"Email required"
    }),
    name: z.string().min(1, {
        message:"Name required"
    }),
    lastname: z.string().min(1, {
        message:"Lastname required"
    }),
    password: z.string().min(8, {
        message:"Password required (min length 8)"
    }),
    passwordConfirm: z.string().min(8, {
        message:"Passwords must be the same"
    }),
});