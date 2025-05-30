import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/server'
import { generateInterviewQuestionsPrompt } from '@/lib/prompts'
import { openai } from '@/lib/openai'
import { randomUUID } from 'crypto'

// Just for testing
export async function GET() {
  return NextResponse.json({ message: 'Hello, world!' })
}

export async function POST(req: NextRequest) {
  try {
    // Get request body
    const { type, role, level, techstack, amount, additionalInfo, userid } = await req.json();
    
    // Use the provided userid if it exists and looks like a valid UUID, otherwise generate one
    const finalUserid = userid && userid.length > 10 ? userid : randomUUID();

    const prompt = generateInterviewQuestionsPrompt({type, role, level, techstack, amount, additionalInfo})

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

    // Use regular server client now that RLS policy is relaxed
    const supabase = await createClient()

    // Save to database
    const { error: dbError } = await supabase
      .from('interviews')
      .insert({
        user_id: finalUserid,
        questions: questions,
        type: type,
        role: role,
        level: level,
        techstack: techstack,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError);
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
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Something went wrong'
      },
      { status: 500 }
    )
  }
}
