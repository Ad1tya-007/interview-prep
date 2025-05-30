type InterviewQuestionsPromptData = {
  type: string;
  role: string;
  level: string;
  techstack: string[];
  amount: string;
  additionalInfo: string;
}

export function generateInterviewQuestionsPrompt(data: InterviewQuestionsPromptData) {
  const { type, role, level, techstack, amount, additionalInfo } = data;
  return `
    You are an expert technical interviewer. You task is to generate interview questions based on the given information.
    The job role is ${role}.
    The job experience level is ${level}.
    The techstack used in the job is: ${techstack.join(', ')}.
    The focus between behavioral and technical questions should lean towards: ${type}.
    The amount of questions is ${amount}.
    ${additionalInfo ? `The additional information is: ${additionalInfo}.` : ''}

    Please return only the questions without any additional text.
    The questions are going to be read by a voice assistant, so dont use "/" or "*" ir any other special characters which might break the voice assistant.
    Return the questions formatted like this:
    ["Question 1", "Question 2", "Question 3"]
  `
}