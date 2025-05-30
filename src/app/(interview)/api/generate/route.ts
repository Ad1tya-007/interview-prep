import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/server'
import { generateInterviewQuestionsPrompt } from '@/lib/prompts'
import { openai } from '@/lib/openai'

// Just for testing
export async function GET() {
  return NextResponse.json({ message: 'Hello, world!' })
}

export async function POST(req: NextRequest) {
  try {
    // Get request body
    const { type, role, level, techstack, amount, userid } = await req.json();

    const prompt = generateInterviewQuestionsPrompt({type, role, level, techstack, amount})

    // Generate questions using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: false,
      messages: [
        {
          role: "system",
          content: "You are an expert technical interviewer. Your responses must be in valid JSON format. Return an array of questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 150, 
    })

    const response = JSON.parse(completion.choices[0].message.content || '[]');

    const questions = Array.isArray(response) ? response : response.questions || [];

    const supabase = await createClient()

    // Save to database
    const { error: dbError } = await supabase
      .from('interviews')
      .insert({
        user_id: userid,
        questions: questions,
        type: type,
        role: role,
        level: level,
        techstack: techstack.split(",").map((tech: string) => tech.trim()),
      })
      .select()
      .single()

    if (dbError) {
      return NextResponse.json(
        { error: dbError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      questions, 
    })

  } catch (error) {
    console.error('Error generating interview questions:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Something went wrong'
      },
      { status: 500 }
    )
  }
}
