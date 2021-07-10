import { PrismaClient } from '@prisma/client'
import { Handler } from "@netlify/functions";
const prisma = new PrismaClient()

const handler: Handler = async (event, context, callback) => {
  try {
    const users = await prisma.user.findMany({
      include: { Post: true }
    })
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(users)
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error)
    }
  }
}


export { handler };