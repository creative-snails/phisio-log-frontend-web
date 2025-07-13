const mockResponses = [
  "Thank you for sharing that information. You mentioned only one symptom. Are there any **additional symptoms** you would like to add to your health record?",
  `Have you tried any treatments on your own to manage your condition?
  #### This could include:
  - Over-the-counter medications
  - Home remedies
  - Lifestyle changes
  - Exercises or stretches`,
  `You can ~ignore~ skip this step if you're not in pain.`,
  `#### Weekly Summary
  1. [x] Daily walk
  2. [x] Stretching
  3. [x] Hydration reminder
  \nYou’ve completed all your goals this week 🎉`,
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
  return `I understand you mentioned:
  *${userMessage?.substring(0, 30)}${userMessage && userMessage.length > 30 ? "..." : ""}.*
  I'm sorry, I couldn't process your request at the moment. You can learn more by visiting our [official website](https://media.gifdb.com/sticking-tongue-out-blah-pygmy-fq25s691x5suwkue.gif)!`;
};
