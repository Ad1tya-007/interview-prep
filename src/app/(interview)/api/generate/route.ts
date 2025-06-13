import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/server'
import { generateInterviewQuestionsPrompt } from '@/lib/prompts'
import { openai } from '@/lib/openai'
import { revalidatePath } from 'next/cache'

// Just for testing
export async function GET() {
  return NextResponse.json({ message: 'Hello, world!' })
}

export async function POST(req: NextRequest) {
  try {
    // Get request body
    const { info, userid } = await req.json();

    if(!info || !userid) {
      return NextResponse.json({ error: 'Missing info or userid' }, { status: 400 })
    }
  
    const prompt = generateInterviewQuestionsPrompt({ info })

    // Generate questions using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-0125-preview",
      stream: false,
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer. Your responses must be in valid JSON format following the exact structure specified in the prompt."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = JSON.parse(completion.choices[0].message.content || '{}');

    // Validate response structure
    if (!response.type || !response.role || !response.questions || !Array.isArray(response.questions)) {
      throw new Error('Invalid response format from AI');
    }

    // Use regular server client now that RLS policy is relaxed
    const supabase = await createClient()

    // Save to database
    const { error: dbError } = await supabase
      .from('interviews')
      .insert({
        user_id: userid,
        questions: response.questions,
        type: response.type,
        role: response.role,
        level: response.level,
        tags: response.tags,
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

    revalidatePath('/interviews')

    return NextResponse.json({ 
      success: true,
      interview: {
        type: response.type,
        role: response.role,
        level: response.level,
        tags: response.tags,
        questions: response.questions,
      }
    })

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Something went wrong'
      },
      { status: 500 }
    )
  }
}
