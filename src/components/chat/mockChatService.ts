const mockResponses = [
  "I can assist you in **creating a new health journal entry**, **updating existing records**, or **navigating the app**. To get started, could you tell me a bit about your current health concern or goal?",
  "Thank you for sharing that information. You mentioned only one symptom. Are there any **additional symptoms** you would like to add to your health record?",
  `Have you tried any treatments on your own to manage your condition? If yes, please share the details.
  This could include:
  - Over-the-counter medications
  - Home remedies
  - Lifestyle changes
  - Exercises or stretches`,
  "Would you like me to **summarize** what you've told me so far about your condition?",
];

let conversationTurn = 0;

export const getAssistantResponse = (userMessage: string): string => {
  if (conversationTurn < mockResponses.length) {
    const response = mockResponses[Math.floor(conversationTurn)];
    // Using 0.5 increments handles React Strict Mode's double invocation
    conversationTurn += 0.5;

    return response;
  }

  // Fallback response
  return `I understand you mentioned: *${userMessage?.substring(0, 30)}${userMessage && userMessage.length > 30 ? "..." : ""}*. How else can I assist you with your health tracking?`;
};
