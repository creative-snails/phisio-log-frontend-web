const mockResponses = [
  "I can assist you in **creating a new health journal entry**, **updating existing records**, or **navigating the app**. To get started, could you tell me a bit about your current health concern or goal?",
  "Thank you for sharing that information. You mentioned only one symptom. Are there any **additional symptoms** you would like to add to your health record? This helps create a more comprehensive picture of your condition.",
  "Have you tried any treatments on your own to manage your condition? If yes, please share the details.\n\nThis could include:\n* Over-the-counter medications\n* Home remedies\n* Lifestyle changes\n* Exercises or stretches",
  "Would you like me to **summarize** what you've told me so far about your condition?",
  "I can help you **track your progress** over time. How often would you like to log updates about this condition?",
];

export const getAssistantResponse = () => {
  const responseMessage = mockResponses[Math.floor(Math.random() * mockResponses.length)];

  return responseMessage;
};
