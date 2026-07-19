import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  try {
    return new PrismaClient()
  } catch (error) {
    console.warn("PrismaClient initialization error:", error)
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error("PrismaClient is not initialized")
      }
    })
  }
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
