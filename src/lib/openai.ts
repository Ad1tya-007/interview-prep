import OpenAI from 'openai'

if (!process.env.OPENAI_KEY) {
  throw new Error('OPENAI_KEY is not set')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY!,
})