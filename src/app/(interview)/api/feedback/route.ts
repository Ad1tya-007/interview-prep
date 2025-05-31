import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { messages } = await req.json();
    const interviewId = params.id;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Get the interview details
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .eq('user_id', user.id)
      .single();

    if (interviewError || !interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    // Generate feedback using OpenAI
    const conversationText = messages
      .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
      .join('\n');

    const feedbackPrompt = `
You are an expert interview evaluator. Based on the following interview conversation, provide detailed feedback on the candidate's performance. 

Interview Details:
- Role: ${interview.role}
- Type: ${interview.type}
- Level: ${interview.level}
- Tech Stack: ${interview.techstack.join(', ')}

Interview Conversation:
${conversationText}

Please evaluate the candidate in the following 5 areas and provide a score out of 100 and detailed comments for each:

1. Communication Skills - How clearly and effectively did they communicate?
2. Technical Knowledge - How well did they demonstrate relevant technical expertise?
3. Problem Solving - How effectively did they approach and solve problems?
4. Cultural Fit - How well would they fit with typical team dynamics and company culture?
5. Confidence and Clarity - How confident and clear were they in their responses?

Return your evaluation in the following JSON format:
{
  "communication_skills": {
    "score": number (0-100),
    "comments": "detailed feedback"
  },
  "technical_knowledge": {
    "score": number (0-100),
    "comments": "detailed feedback"
  },
  "problem_solving": {
    "score": number (0-100),
    "comments": "detailed feedback"
  },
  "cultural_fit": {
    "score": number (0-100),
    "comments": "detailed feedback"
  },
  "confidence_and_clarity": {
    "score": number (0-100),
    "comments": "detailed feedback"
  }
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: false,
      messages: [
        {
          role: "system",
          content: "You are an expert interview evaluator. Provide detailed, constructive feedback in the specified JSON format."
        },
        {
          role: "user",
          content: feedbackPrompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 1500,
    });

    const feedback = JSON.parse(completion.choices[0].message.content || '{}');

    // Save the report to the database
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        interview_id: interviewId,
        feedback: feedback,
      })
      .select()
      .single();

    if (reportError) {
      console.error('Database error:', reportError);
      return NextResponse.json(
        { error: 'Failed to save report' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      report: report,
      feedback: feedback
    });

  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Something went wrong'
      },
      { status: 500 }
    );
  }
}
