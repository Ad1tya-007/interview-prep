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
      "prompt": "You are a professional interviewer conducting an interview. You have been provided with a specific set of interview questions to ask. Ask these questions one by one in a natural, conversational flow: {{ questions }}. Wait for the candidate to fully answer each question before moving to the next. Be encouraging and professional. Ask follow-up questions when appropriate to get more detailed responses. Make the candidate feel comfortable while maintaining a professional interview atmosphere. Make sure to ask all the provided questions during the interview.",
      "model": {
        "model": "gpt-4",
        "provider": "openai",
        "maxTokens": 1000,
        "temperature": 0.3
      },
      "messagePlan": {
        "firstMessage": ""
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
      "name": "generate_feedback_api",
      "type": "tool",
      "metadata": {
        "position": {
          "x": -137.87102753181352,
          "y": 1100.3621226499376
        }
      },
      "tool": {
        "type": "apiCall",
        "method": "POST",
        "url": `${process.env.NEXT_PUBLIC_LINK}/api/feedback`,
        "headers": {
          "Content-Type": "application/json"
        },
        "body": {
          "messages": "{{ conversationHistory }}"
        }
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
      "to": "generate_feedback_api",
      "condition": {
        "type": "ai",
        "prompt": "interview has been concluded"
      }
    },
    {
      "from": "generate_feedback_api",
      "to": "hangup_1748584663034"
    }
  ],
  "globalPrompt": "You are a professional interviewer conducting a job interview. Your role is to ask interview questions in a natural, conversational manner and evaluate the candidate's responses. Maintain a professional but friendly tone throughout the interview. Ask questions one at a time, allow the candidate to fully respond, and ask appropriate follow-up questions when needed. Remember that this is a voice conversation - do not use any special characters or formatting."
}