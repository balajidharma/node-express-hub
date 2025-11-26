import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from '@prisma/client/mongodb-app/client.js';

const prisma = new PrismaClient();
export const auth = betterAuth({
    advanced: {
        disableOriginCheck: process.env.NODE_ENV !== 'production',
    },
    emailAndPassword: {
        enabled: true,
        sendResetPassword: async ({user, url, token}, request) => {
            // await sendEmail({
            //     to: user.email,
            //     subject: "Reset your password",
            //     text: `Click the link to reset your password: ${url}`,
            // });
        },
        onPasswordReset: async ({ user }, request) => {

        },
    },
    database: prismaAdapter(prisma, {
        provider: "mongodb", // or "mysql", "postgresql", ...etc
    }),
    plugins: [username()],
});