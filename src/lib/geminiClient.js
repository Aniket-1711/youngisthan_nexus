import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
// It relies on VITE_GEMINI_API_KEY from environment variables
const getGeminiClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not defined in the environment.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

const genAI = getGeminiClient();

// The summaries dictionary provided in the prompt
const videoSummaries = {
  "Social History": "This video illustrates the progression of power in India from 1526 to 2025 using interactive maps and a chronological timeline of rulers. It begins with the rise of the Mughal Empire under Babur, showing its peak and eventual decline following Aurangzeb. The visual narrative transitions through the emergence of the Maratha Empire and the expanding influence of the British East India Company, culminating in British colonial rule. Following history:independence in 1947, the focus shifts to India's Prime Ministers, tracing the nation's democratic history through leaders like Jawaharlal Nehru to the current administration of Narendra Modi.",
  "Trigonometry": "This video explains how to find unknown angles and sides in right-angled triangles using trigonometry. It introduces the mnemonic SOH CAH TOA to help students remember the three core equations: Sin(x) = Opposite / Hypotenuse, Cos(x) = Adjacent / Hypotenuse, Tan(x) = Opposite / Adjacent.",
  "Empathy": "This video distinguishes between sympathy and empathy, highlighting how each impacts someone in distress. Sympathy is often counterproductive because it relies on pity and agreement, which confirms a person's 'victim status'. In contrast, empathy empowers individuals by reflecting back a person's feelings and circumstances in plain words, ensuring they feel deeply understood and capable of solving their own problems.",
  "Effective Communications": "Focus entirely on the speaker without planning a response. Use clear, direct sentences. Align body language with your words. Validate others' feelings. Reflect on interactions daily.",
  "Explaining Complicated Concepts Easily": "Test knowledge by explaining to a 5-year-old. Use a top-down approach by leading with the main conclusion. Anticipate the audience's perspective and potential confusion.",
  "Water Cycle": "Evaporation: Sun heats water turning it into vapor. Condensation: Vapor cools to form clouds. Precipitation: Clouds release water as rain/snow. It also covers transpiration and sublimation.",
  "Increase Student Engagement": "Incorporate diverse learning styles. Use callbacks. Hook students with pop culture. Use gamification. Allow student choice. Use interactive tools and brain breaks.",
  "Teaching Techniques": "Engagement sparks curiosity. Using creative narration with props and gestures aids memory retention and supports inclusion. Requires relatable characters, clear plot, meaningful theme."
};

/**
 * Normalizes a video title to match keys in the dictionary
 */
const getContextSummary = (title) => {
  if (!title) return "No specific video context provided.";
  
  const lowerTitle = title.toLowerCase();
  for (const [key, value] of Object.entries(videoSummaries)) {
    if (lowerTitle.includes(key.toLowerCase())) {
      return value;
    }
  }
  return "General educational video.";
};

/**
 * Handles generating a response from Gemini
 */
export async function getChatbotResponse(userMessage, videoTitle, isMentor, learnToTeachMode) {
  if (!genAI) {
    return "Error: Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
  }

  const contextSummary = getContextSummary(videoTitle);
  
  // Base system instructions based on persona
  let systemPrompt = "";
  
  if (isMentor && learnToTeachMode) {
    systemPrompt = `
You are an expert pedagogical coach for a Mentor who is teaching a student. 
The Mentor is watching a video titled: "${videoTitle}".
Video Content Summary: "${contextSummary}".

INSTRUCTIONS:
1. The user (a Mentor) is asking you how to deal with specific types of students or how to teach the concepts in this video interactively.
2. Provide interactive teaching strategies, icebreakers, and advice on adapting this specific material for their student.
3. Keep your response CONCISE, fast, and structured (2-3 short paragraphs max).
4. Use formatting like bullet points or bold text if it helps readability.
    `;
  } else {
    // Normal tutor mode (for students OR mentors normally)
    systemPrompt = `
You are a friendly, intelligent learning assistant acting as a tutor.
The user is watching an educational video titled: "${videoTitle}".
Video Content Summary: "${contextSummary}".

INSTRUCTIONS:
1. Understand the user's query contextually based ONLY on the video summary provided.
2. Provide a clear, concise, and insightful response. 
3. If they ask a specific question (e.g., "Why the jewelry?"), draw on general knowledge that connects directly to the historical, scientific, or conceptual context of the video.
4. Keep the response FAST, storytelling-oriented, highly interactive, and NO LONGER than 2 to 3 sentences.
    `;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Construct the payload
    // Gemini 1.5 allows system instructions directly in the config, but we can also prepend it to support older versions if needed, or use the `systemInstruction` field natively.
    const chatModel = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt 
    });

    const result = await chatModel.generateContent(userMessage);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!";
  }
}
