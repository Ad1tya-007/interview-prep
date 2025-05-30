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
      "exact": "Hello, {{ name }}! Lets prepare your interview. I will ask you a few questions and generate a perfect interview just for you. Are you ready."
    },
    {
      "name": "Conversation",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -132.80706991403252,
          "y": 322.04135816994057
        }
      },
      "prompt": "Ask the user what kind of interview they would like to create. Focus on understanding their intent and capturing any relevant details they provide.",
      "model": {
        "model": "gpt-4o",
        "provider": "openai",
        "maxTokens": 1000,
        "temperature": 0.3
      },
      "variableExtractionPlan": {
        "output": [
          {
            "enum": [],
            "type": "string",
            "title": "role",
            "description": "What role would you like to train for?"
          },
          {
            "enum": [],
            "type": "string",
            "title": "type",
            "description": "Are you aiming for a technical, behavioral or mixed interview?"
          },
          {
            "enum": [
              "entry",
              "mid",
              "senior"
            ],
            "type": "string",
            "title": "level",
            "description": "The job experience level."
          },
          {
            "enum": [],
            "type": "string",
            "title": "techstack",
            "description": "A list of technologies to cover during the job interview."
          },
          {
            "enum": [],
            "type": "string",
            "title": "amount",
            "description": "How many questions would you like me to prepare?"
          }
        ]
      },
      "messagePlan": {
        "firstMessage": ""
      }
    },
    {
      "name": "API Request",
      "type": "tool",
      "metadata": {
        "position": {
          "x": -142.16087351180352,
          "y": 691.4728088248361
        }
      },
      "tool": {
        "url": `${process.env.NEXT_PUBLIC_LINK}/api/generate`,
        "body": {
          "type": "object",
          "required": [
            "role",
            "type",
            "level",
            "techstack",
            "amount",
            "userid"
          ],
          "properties": {
            "role": {
              "type": "string",
              "value": "{{ role }}",
              "description": ""
            },
            "type": {
              "type": "string",
              "value": "{{ type }}",
              "description": ""
            },
            "level": {
              "type": "string",
              "value": "{{ level }}",
              "description": ""
            },
            "amount": {
              "type": "string",
              "value": "{{ amount }}",
              "description": ""
            },
            "userid": {
              "type": "string",
              "value": "{{userid}}",
              "description": ""
            },
            "techstack": {
              "type": "string",
              "value": "{{ techstack }}",
              "description": ""
            }
          }
        },
        "name": "generateInterview",
        "type": "apiRequest",
        "method": "POST",
        "function": {
          "name": "untitled_tool",
          "parameters": {
            "type": "object",
            "required": [],
            "properties": {}
          }
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
    },
    {
      "name": "node_1748584892250",
      "type": "conversation",
      "metadata": {
        "position": {
          "x": -137.6148515576732,
          "y": 983.8109665168779
        }
      },
      "prompt": "Say that the interview has been generated and thank the user for the call.",
      "model": {
        "model": "gpt-4o",
        "provider": "openai",
        "maxTokens": 1000,
        "temperature": 0.7
      },
      "messagePlan": {
        "firstMessage": ""
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
      "to": "Conversation",
      "condition": {
        "type": "ai",
        "prompt": "user said yes"
      }
    },
    {
      "from": "Conversation",
      "to": "API Request",
      "condition": {
        "type": "ai",
        "prompt": "If user has given the role, type, level, techstack and amount of questions."
      }
    },
    {
      "from": "API Request",
      "to": "node_1748584892250",
      "condition": {
        "type": "ai",
        "prompt": ""
      }
    },
    {
      "from": "node_1748584892250",
      "to": "hangup_1748584663034",
      "condition": {
        "type": "ai",
        "prompt": ""
      }
    }
  ],
  "globalPrompt": "You are a friendly and knowledgeable conversation assistant here to guide users through a smooth and helpful experience.\nYour role is to ask the right questions, listen carefully, and provide clear and relevant responses based on what the user shares.\nMaintain a calm, approachable, and professional tone. Adapt naturally to the flow of the conversation, making users feel understood and supported throughout their interaction.\n\nRemember that this is a voice conversation - do not use any special characters."
}