import { PrismaClient } from "@prisma/client";

// Function to create a new PrismaClient instance
const prismaClientSingleton = ()=>{
    return new PrismaClient();
}

// Extend the globalThis object to include prismaGlobal
declare const globalThis: {
    prismaGlobal : ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Use the existing prismaGlobal instance if it exists, otherwise create a new one
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// In development mode, assign the prisma instance to globalThis.prismaGlobal
if(process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

export default prisma;

