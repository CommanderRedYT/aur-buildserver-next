import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const prismaClientSingleton = () => new PrismaClient({
    // log: process.env.NODE_ENV === 'development' ? ['query'] : undefined,
});

declare global {
    // eslint-disable-next-line no-var,vars-on-top
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// eslint-disable-next-line import/prefer-default-export
export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
