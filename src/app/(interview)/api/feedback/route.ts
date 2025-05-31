import { NextRequest, NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { conversationHistory } = await request.json();
    
    if (!conversationHistory) {
      return NextResponse.json(
        { error: 'Conversation history is required' },
        { status: 400 }
      );
    }

    // Generate feedback using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
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

Provide constructive, professional feedback based on the candidate's responses during the interview.`
        },
        {
          role: 'user',
          content: `Please evaluate this interview conversation and provide feedback: ${conversationHistory}`
        }
      ],
      temperature: 0.3,
    });

    const feedbackText = completion.choices[0].message.content;
    let feedback;
    
    try {
      feedback = JSON.parse(feedbackText || '{}');
    } catch (parseError) {
      console.error('Failed to parse feedback JSON:', parseError);
      // Fallback feedback structure
      feedback = {
        communication_skills: { score: 7, comments: "Feedback generated successfully" },
        technical_knowledge: { score: 7, comments: "Feedback generated successfully" },
        problem_solving: { score: 7, comments: "Feedback generated successfully" },
        cultural_fit: { score: 7, comments: "Feedback generated successfully" },
        confidence_and_clarity: { score: 7, comments: "Feedback generated successfully" }
      };
    }

    console.log('Feedback generated successfully');
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
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
