# PhisioLog

**PhisioLog** is a health journaling web application designed to help users log detailed information about their physiological state or condition. Users can track specific organs, symptoms, remedies, diets, and other health-related data. The app allows users to document their experiences, view entries on a calendar, and generate reports to analyze trends over time. For example, users can review their main physical concerns over the past year, identify potential causes, and evaluate the effectiveness of treatments.

---

## 🛠 Tech Stack

### Frontend

- **Framework:** [React](https://reactjs.org/)  
  _Reason:_ React provides a robust foundation for building responsive and interactive web applications with a wide ecosystem of libraries and tools.

- **UI Library:** Vanilla CSS or utility-first frameworks like [Tailwind CSS](https://tailwindcss.com/)  
  _Reason:_ Lightweight and flexible styling options allow for precise control over component rendering and responsiveness.

- **State Management:** React's built-in tools (`useState`, `useReducer`, `Context API`)  
  _Reason:_ Ideal for managing state in small to medium apps. Consider [Zustand](https://github.com/pmndrs/zustand) if state complexity grows, due to its minimal API and performance advantages.

- **Audio Input Support:**
  - **Audio Capture:** Web Speech API or third-party browser-compatible libraries.
  - **Speech-to-Text:** [Google Cloud Speech-to-Text](https://cloud.google.com/speech-to-text) or similar APIs.
  - **Text Processing:** Use [ChatGPT API](https://platform.openai.com/docs) (starting with GPT-3.5 Turbo) to interpret and structure audio transcripts.
  - **JSON Structuring:** Transcribed text is converted into structured JSON.
  - **User Confirmation:** Users can review and edit structured data before saving.

- **File Storage:** Integration with cloud services (e.g., AWS S3 or browser-compatible alternatives) to allow users to upload and store medical documents like test results.

- **Notifications (Optional):**
  - **Browser Notifications:** Use browser push APIs or tools like [OneSignal](https://onesignal.com/) for sending notifications.
  - **Custom Notifications:** In-app notification components can be built for simpler use cases.

---

## ✨ Key Features

- **Body and Organ Selection:** Visual interface with icons to break down the body by system (e.g., skin, muscle, bone, internal organs). Users can log issues by selecting specific areas.

- **Symptom and Pain Tracking:** Record detailed notes about symptoms, intensity levels, and types of discomfort or pain.

- **Treatment and Alleviation Techniques:** Log various treatments, medications, or techniques tried for symptom relief.

- **Calendar Integration:** Track symptoms and treatments on a calendar to visualize progress and patterns over time.

- **Test Results:** Upload and view important medical files (e.g., PDFs, images) in a secure and organized manner.

- **Data Privacy:** Aim to implement strong client-side encryption such as AES-256 to protect user data stored locally or in the cloud.

- **Automated Reports:** Enable users to generate and download periodic reports (CSV, PDF, or JSON) of their health logs for backup or sharing.

---

## 📌 Notes

- This project is being developed with a focus on **web-first** experience using modern React tooling.
- Future support for mobile or desktop may be explored depending on user demand.

---

