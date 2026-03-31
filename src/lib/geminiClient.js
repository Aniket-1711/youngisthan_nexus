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
const MODEL_CANDIDATES = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];

function getFriendlyErrorMessage(error) {
  const rawMessage = error?.message || String(error || '');
  const message = rawMessage.toLowerCase();

  if (message.includes('api key not valid') || message.includes('api_key_invalid')) {
    return 'Error: Your Gemini API key is invalid. Generate a fresh key in Google AI Studio and update VITE_GEMINI_API_KEY.';
  }
  if (message.includes('referer') || message.includes('referrer')) {
    return 'Error: Your Gemini key has HTTP referrer restrictions blocking localhost. Update key restrictions in Google Cloud Console.';
  }
  if (message.includes('quota') || message.includes('rate limit') || message.includes('resource_exhausted')) {
    return 'Error: Gemini quota/rate limit reached. Wait a bit or use a different API key/project.';
  }
  if (message.includes('permission') || message.includes('unauthorized') || message.includes('forbidden')) {
    return 'Error: This Gemini key does not have permission for the requested model.';
  }
  return `Error: Gemini request failed. ${rawMessage}`;
}

// Hardcoded video title + summary context (as provided)
const videoKnowledgeBase = [
  {
    title: 'Social History (vid)',
    aliases: ['social history', 'history'],
    summary:
      "history:This video illustrates the progression of power in India from 1526 to 2025 using interactive maps and a chronological timeline of rulers. It begins with the rise of the Mughal Empire under Babur, showing its peak and eventual decline following Aurangzeb. The visual narrative transitions through the emergence of the Maratha Empire and the expanding influence of the British East India Company, culminating in British colonial rule. Following history:independence in 1947, the focus shifts to India's Prime Ministers, tracing the nation's democratic history through leaders like Jawaharlal Nehru to the current administration of Narendra Modi.",
  },
  {
    title: 'Trigonometry',
    aliases: ['trigonometry', 'trignometry', 'soh cah toa'],
    summary:
      'trigonometry :This video explains how to find unknown angles and sides in right-angled triangles using trigonometry. It introduces the mnemonic SOH CAH TOA to help students remember the three core equations: Sin(x) = Opposite / Hypotenuse Cos(x) = Adjacent / Hypotenuse Tan(x) = Opposite / Adjacent',
  },
  {
    title: 'Empathy',
    aliases: ['empathy', 'sympathy'],
    summary:
      `empathy: This video distinguishes between sympathy and empathy, highlighting how each impacts someone in distress. Sympathy is often counterproductive because it relies on pity and agreement, which confirms a person's "victim status" and makes their situation feel more intimidating. While sympathy might feel momentarily comforting, it often leads to failed rescue attempts. In contrast, empathy empowers individuals. By reflecting back a person's feelings and circumstances in plain words, empathy ensures they feel deeply understood. This process helps them regain perspective and the belief that they can solve their own problems, making empathy the only effective path to a lasting solution.`,
  },
  {
    title: 'effective communications',
    aliases: ['effective communications', 'communication', 'communications'],
    summary:
      'communication:Active Listening: Focus entirely on the speaker without planning a response, using eye contact and summarizing their points to build trust. Simple Language: Use clear, direct sentences and avoid complex jargon to ensure your message is easily understood. Body Language: Align your physical presence-like posture and facial expressions-with your words, as non-verbal cues often speak louder. Empathy: Validate others\' feelings to create a supportive atmosphere and deeper connections. Consistent Practice: Reflect on interactions daily to refine these skills over time.',
  },
  {
    title: 'explaining complicated concepts easily',
    aliases: ['explaining complicated concepts easily', 'complicated concepts'],
    summary:
      `explaining complicated concepts easily:Deep Understanding: Test your knowledge by explaining the topic to a "5-year-old." If you must use jargon, you don't understand it well enough. Break ideas down to first principles. Structured Communication: Use a "top-down" approach by leading with the main conclusion or recommendation first, followed by supporting details. This primes the listener's brain and respects their time. Empathy: Anticipate your audience's perspective and potential confusion. Addressing their silent questions makes them feel heard and ensures the message truly resonates`,
  },
  {
    title: 'water cycle',
    aliases: ['water cycle', 'evaporation', 'condensation', 'precipitation'],
    summary:
      'water cycle :the water cycle as a continuous three-step process: Evaporation: The sun heats water in oceans and rivers, turning it into water vapor that rises into the air. Condensation: High in the sky, vapor cools and combines with dust and gases to form clouds. Precipitation: When clouds become too heavy, they release water as rain, hail, or snow. The video also introduces transpiration (plants releasing moisture) and sublimation (snow turning directly into vapor).',
  },
  {
    title: 'ways to increase student engagement',
    aliases: ['increase student engagement', 'student engagment', 'engagement'],
    summary:
      'increase student engagment:ten practical strategies for teachers to boost student engagement. Add Variation: Incorporate diverse learning styles (visual, kinesthetic, auditory) using hands-on activities, videos, and music. Use Callbacks: Establish routines like "1, 2, 3, eyes on me" to quickly refocus the class. Relate Content: Hook students by integrating pop culture, social media, and their personal interests. Gamification: Use points, leaderboards, and badges to motivate students. Student Choice: Allow students to decide on project topics, mediums, or seating to increase intrinsic motivation. Full Participation: Use edtech tools or non-tech signals (like thumbs up) to engage the entire class at once. Frequent Assessment: Use pre-tests and exit tickets to gauge comprehension and progress. Encourage Collaboration: Implement activities like "Think-Pair-Share" to let students learn from peers. Brain Breaks: Use quick, high-energy activities like a "freeze dance" to release pent-up energy. Interactive Tools: Utilize tablets and quiz games to make assignments more engaging',
  },
  {
    title: 'teachingTechniques',
    aliases: ['teaching techniques', 'teachingtechniques', 'storytelling'],
    summary:
      `Engagement: It sparks curiosity, boosts imagination, and serves as an "icebreaker" for new topics. Skill Development: It enhances listening, expands vocabulary, and aids memory retention of difficult facts. Inclusivity: Creative narration using props, gestures, and voice modulation can re-engage inattentive students and support those with special needs. Effective stories require relatable characters, a clear plot, a meaningful theme, and an immersive setting. Teachers should narrate slowly, involve students with questions, and maintain an expressive atmosphere.`,
  },
];

/**
 * Normalizes a video title to match keys in the dictionary
 */
const getContextSummary = (title) => {
  if (!title) {
    return {
      matchedTitle: 'General educational video',
      summary: 'General educational video.',
    };
  }

  const lowerTitle = title.toLowerCase();
  const match = videoKnowledgeBase.find((item) =>
    item.aliases.some((alias) => lowerTitle.includes(alias.toLowerCase()))
  );

  if (match) {
    return {
      matchedTitle: match.title,
      summary: match.summary,
    };
  }

  return {
    matchedTitle: title,
    summary: 'General educational video.',
  };
};

const findMentionedVideo = (message) => {
  if (!message) return null;
  const lowerMessage = message.toLowerCase();
  return videoKnowledgeBase.find(
    (item) =>
      lowerMessage.includes(item.title.toLowerCase()) ||
      item.aliases.some((alias) => lowerMessage.includes(alias.toLowerCase()))
  );
};

const isSummaryIntent = (message) => {
  if (!message) return false;
  const lower = message.toLowerCase();
  return (
    lower.includes('summary') ||
    lower.includes('summarize') ||
    lower.includes('summarise') ||
    lower.includes('explain this video') ||
    lower.includes('what is this video about')
  );
};

const looksTruncated = (text) => {
  if (!text) return false;
  const t = text.trim();
  if (t.length < 40) return false;
  if (t.endsWith('-') || t.endsWith('—') || t.endsWith('–')) return true;
  if (/[,:;]$/.test(t)) return true;
  // If it doesn't end in a natural sentence boundary, we treat it as potentially cut.
  if (!/[.!?]"?$/.test(t)) return true;
  return false;
};

async function generateOnce(chatModel, userText, generationConfig) {
  const result = await chatModel.generateContent({
    generationConfig,
    contents: [{ role: 'user', parts: [{ text: userText }] }],
  });
  const response = await result.response;
  return response.text?.().trim() || '';
}

/**
 * Handles generating a response from Gemini
 */
export async function getChatbotResponse(userMessage, videoTitle, isMentor, learnToTeachMode) {
  if (!genAI) {
    return "Error: Gemini API Key is missing. Please add VITE_GEMINI_API_KEY to your .env file.";
  }
  if (!userMessage?.trim()) {
    return 'Please ask a question so I can help.';
  }

  const activeContextInfo = getContextSummary(videoTitle);
  const mentionedVideo = findMentionedVideo(userMessage);
  const wantsSummary = isSummaryIntent(userMessage);

  const selectedTitle = mentionedVideo?.title || activeContextInfo.matchedTitle;
  const selectedSummary = mentionedVideo?.summary || activeContextInfo.summary;
  
  // Build focused system prompts
  let systemPrompt = "";
  
  if (isMentor && learnToTeachMode) {
    systemPrompt = `You are Nexus AI in Learn-to-Teach mode for mentors.
Active Video Title: "${activeContextInfo.matchedTitle}".
Selected Video Title for Current Query: "${selectedTitle}".
Selected Video Summary Context: "${selectedSummary}".

RULES (STRICT):
- Mentor may ask about teaching strategy OR any general question.
- If mentor asks summary and names a specific video title, summarize that specific video.
- If no specific video title is given for summary, summarize the currently active video.
- For non-summary questions, answer normally even if not related to the active video.
- Keep response fast and lightweight. Avoid overthinking or long analysis.
- Use a warm senior-teacher coaching style with interactive wording.
- Provide a complete response with enough detail to be useful; do not cut off mid-thought.
- Never start with "Sure" or "Great question". Start with the actual guidance.`;
  } else {
    systemPrompt = `You are Nexus AI, a context-aware tutor helping a learner in real time.
Active Video Title: "${activeContextInfo.matchedTitle}".
Selected Video Title for Current Query: "${selectedTitle}".
Selected Video Summary Context: "${selectedSummary}".

RULES (STRICT):
- If user asks summary and names a specific video title, summarize that specific video.
- If no specific video title is given for summary, summarize the active video.
- For non-summary questions, answer any learner question clearly; use active video context when helpful.
- Include insight and "why it matters", not just keywords.
- Use storytelling conversational tone for engagement.
- Give a complete answer in natural language; do not truncate mid-sentence.
- Never start with "Sure" or "Great question".`;
  }

  let lastError = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const chatModel = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
      });

      const baseConfig = {
        maxOutputTokens: 650,
        temperature: 0.75,
        topP: 0.9,
      };

      const first = await generateOnce(
        chatModel,
        `User message: "${userMessage}".
Summary intent detected: ${wantsSummary ? 'yes' : 'no'}.
Answer clearly and completely.`,
        baseConfig
      );

      if (first) {
        if (!looksTruncated(first)) return first;

        // One fast continuation pass to prevent cut-off endings.
        const continuation = await generateOnce(
          chatModel,
          `The previous answer was cut off. Continue from EXACTLY where it stopped, without repeating.

Previous answer:
${first}`,
          { ...baseConfig, maxOutputTokens: 220, temperature: 0.65 }
        );

        const combined = `${first}${first.endsWith('-') ? '' : ' '}${continuation}`.trim();
        return continuation ? combined : first;
      }
      lastError = new Error(`Empty response from ${modelName}`);
    } catch (error) {
      lastError = error;
      console.error(`Gemini API Error (${modelName}):`, error);
    }
  }

  return getFriendlyErrorMessage(lastError);
}
