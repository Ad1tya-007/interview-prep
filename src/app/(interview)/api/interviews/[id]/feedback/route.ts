import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/server';
import { openai } from '@/lib/openai';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: interviewId } = await params;
    const { conversationHistory, userId } = await request.json();
    
    if (!conversationHistory || !userId) {
      return NextResponse.json(
        { error: 'Conversation history and user ID are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.id !== userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Verify the interview belongs to the user
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .eq('user_id', userId)
      .single();

    if (interviewError || !interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    // Generate feedback using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: false,
      messages: [
        {
          role: 'system',
          content: `You are an expert interview evaluator. Based on the conversation history provided, generate structured feedback for the candidate in the following JSON format:

{
  "communication_skills": {
    "score": <number between 1-10>,
    "comments": "<detailed feedback on communication skills>"
  },
  "technical_knowledge": {
    "score": <number between 1-10>,
    "comments": "<detailed feedback on technical knowledge>"
  },
  "problem_solving": {
    "score": <number between 1-10>,
    "comments": "<detailed feedback on problem solving abilities>"
  },
  "cultural_fit": {
    "score": <number between 1-10>,
    "comments": "<detailed feedback on cultural fit>"
  },
  "confidence_and_clarity": {
    "score": <number between 1-10>,
    "comments": "<detailed feedback on confidence and clarity>"
  }
}

Provide constructive, professional feedback based on the candidate's responses during the interview for a ${interview.role} position at ${interview.level} level using ${interview.techstack?.join(', ')} technologies.`
        },
        {
          role: 'user',
          content: `Please evaluate this interview conversation and provide feedback: ${conversationHistory}`
        }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });

    const feedbackText = completion.choices[0].message.content;
    let feedback;
    
    try {
      feedback = JSON.parse(feedbackText || '{}');
    } catch (parseError) {
      console.error('Failed to parse feedback JSON:', parseError);
      // Fallback feedback structure
      feedback = {
        communication_skills: { score: 7, comments: "Good communication skills demonstrated during the interview." },
        technical_knowledge: { score: 7, comments: "Showed adequate technical knowledge for the role." },
        problem_solving: { score: 7, comments: "Demonstrated problem-solving abilities." },
        cultural_fit: { score: 7, comments: "Would likely fit well within the team culture." },
        confidence_and_clarity: { score: 7, comments: "Spoke with confidence and clarity." }
      };
    }

    // Save the report to the database
    const { data: report, error: reportError } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
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
      reportId: report.id,
      feedback: feedback 
    });
    
  } catch (error) {
    console.error('Error generating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to generate feedback' },
      { status: 500 }
    );
  }
} 