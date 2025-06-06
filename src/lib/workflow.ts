export const generator = {
  "name": "interview-prep",
  "nodes": [
    {
      "name": "start_node",
      "type": "start",
      "metadata": {
        "position": {
          "x": -19.927630610843423,
          "y": -114.99491547854895
        }
      }
    },
    {
      "name": "say",
      "type": "say",
      "metadata": {
        "position": {
          "x": -124.50525294597915,
          "y": -10.320146956941159
        }
      },
      "prompt": "",
      "exact": "Hello {{ name }}! Welcome to your interview session. I'll be conducting this interview today. Please take your time with each question and answer as thoroughly as you can. Are you ready to begin?"
    },
    {
      "name": "interview_conversation",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -132.80706991403252,
          "y": 322.04135816994057
        }
      },
      "prompt": "You are a professional interviewer conducting an interview. You MUST ask the following specific questions and ONLY these questions:\n\n{{ questions }}\n\nIMPORTANT RULES:\n1. Ask ONLY the questions listed above - do not make up or add any other questions\n2. Ask the questions in the exact order they are listed\n3. Ask one question at a time and wait for a complete answer before moving to the next\n4. You may ask brief clarifying follow-up questions to get more detail on their answer\n5. Do not ask general interview questions like 'tell me about yourself' unless it's specifically in the list above\n6. Stick strictly to the provided questions\n7. Once all questions are answered, move to conclude the interview\n\nStart with the first question from the list above.",
      "model": {
        "model": "gpt-4",
        "provider": "openai",
        "maxTokens": 1000,
        "temperature": 0.1
      },
      "messagePlan": {
        "firstMessage": "Let me ask you the first question from your interview."
      }
    },
    {
      "name": "interview_conclusion",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -137.6148515576732,
          "y": 983.8109665168779
        }
      },
      "prompt": "Conclude the interview professionally. Thank the candidate for their time, let them know they did well, and inform them that they will receive feedback shortly. Be encouraging and positive.",
      "model": {
        "model": "gpt-4",
        "provider": "openai",
        "maxTokens": 1000,
        "temperature": 0.7
      },
      "messagePlan": {
        "firstMessage": ""
      }
    },
    {
      "name": "hangup_1748584663034",
      "type": "tool",
      "metadata": {
        "position": {
          "x": -137.87102753181352,
          "y": 1237.3621226499376
        }
      },
      "tool": {
        "type": "endCall"
      }
    }
  ],
  "edges": [
    {
      "from": "start_node",
      "to": "say"
    },
    {
      "from": "say",
      "to": "interview_conversation",
      "condition": {
        "type": "ai",
        "prompt": "user is ready to begin the interview"
      }
    },
    {
      "from": "interview_conversation",
      "to": "interview_conclusion",
      "condition": {
        "type": "ai",
        "prompt": "all interview questions have been asked and answered"
      }
    },
    {
      "from": "interview_conclusion",
      "to": "hangup_1748584663034",
      "condition": {
        "type": "ai",
        "prompt": "interview has been concluded"
      }
    }
  ],
  "globalPrompt": "You are a professional interviewer conducting a job interview. Your role is to ask interview questions in a natural, conversational manner and evaluate the candidate's responses. Maintain a professional but friendly tone throughout the interview. Ask questions one at a time, allow the candidate to fully respond, and ask appropriate follow-up questions when needed. Remember that this is a voice conversation - do not use any special characters or formatting."
}