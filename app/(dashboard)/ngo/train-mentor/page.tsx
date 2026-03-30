'use client';

import { useEffect, useState } from 'react';
import { getAllMentors, updateMentor } from '@/lib/db';
import type { Mentor } from '@/lib/types';
import { GraduationCap, CheckCircle, Lock, PlayCircle, ChevronDown, ChevronUp } from 'lucide-react';

const TRAINING_MODULES = [
  {
    id: 'track-1-6',
    ageGroup: '1-6',
    title: 'Early Childhood (Ages 1–6)',
    description: 'Child psychology, communication, and play-based learning for young children',
    color: 'bg-pink-50 border-pink-200',
    accent: 'text-pink-600',
    questions: [
      { q: 'What is the most effective teaching approach for children aged 1-6?', opts: ['Lecture-based learning', 'Play-based learning', 'Exam-based assessment', 'Group competition'], ans: 1 },
      { q: 'Which development stage theory is most relevant for early childhood?', opts: ['Piaget\'s formal operations', 'Piaget\'s pre-operational stage', 'Erikson\'s industry vs inferiority', 'Vygotsky\'s ZPD only'], ans: 1 },
      { q: 'How many minutes is the ideal attention span activity block for a 5-year-old?', opts: ['30 minutes', '60 minutes', '10-15 minutes', '45 minutes'], ans: 2 },
      { q: 'What is the primary role of a mentor for a 3-year-old?', opts: ['Drilling facts', 'Building emotional security and curiosity', 'Preparing for exams', 'Teaching advanced literacy'], ans: 1 },
      { q: 'Which of these is the most important for early language development?', opts: ['Worksheets', 'Storytelling and read-alouds', 'Silent reading only', 'Writing exercises'], ans: 1 },
      { q: 'If a child cries and refuses to engage, the mentor should:', opts: ['Scold the child', 'Force participation', 'Give space and re-engage gently', 'End the session immediately'], ans: 2 },
      { q: 'Large motor skills in 1-6 year olds are best developed through:', opts: ['Sitting drills', 'Movement games and outdoor play', 'Coloring only', 'Listening to music'], ans: 1 },
      { q: 'Which communication style works best for young children?', opts: ['Complex vocabulary', 'Short simple sentences with visuals', 'Long explanations', 'Written instructions'], ans: 1 },
      { q: 'What is scaffolding in early education?', opts: ['Building physical structures', 'Providing temporary support to help a child reach the next level', 'Testing without help', 'Peer tutoring only'], ans: 1 },
      { q: 'Praise for young children should be:', opts: ['General ("Good job!")', 'Specific ("You drew a circle all by yourself!")', 'Avoided to prevent overconfidence', 'Only given for perfect work'], ans: 1 },
    ],
  },
  {
    id: 'track-7-12',
    ageGroup: '7-12',
    title: 'Middle Childhood (Ages 7–12)',
    description: 'Academic skill building, reading, math fluency, and confidence development',
    color: 'bg-violet-50 border-violet-200',
    accent: 'text-violet-600',
    questions: [
      { q: 'The Zone of Proximal Development (ZPD) means:', opts: ['What a child can do alone', 'What a child can do with guidance', 'Maximum IQ level', 'Reading grade level'], ans: 1 },
      { q: 'For a child struggling with reading, the mentor should first:', opts: ['Assign harder books', 'Assess their current level and start there', 'Skip to comprehension', 'Give up on reading'], ans: 1 },
      { q: 'Growth mindset in students is developed by:', opts: ['Praising intelligence', 'Praising effort and persistence', 'Avoiding all mistakes', 'Competition only'], ans: 1 },
      { q: 'A 9-year-old who disrupts sessions is likely experiencing:', opts: ['Bad character', 'Unmet needs, stress, or boredom', 'Lack of intelligence', 'Intentional defiance only'], ans: 1 },
      { q: 'Best way to teach multiplication to a struggling student:', opts: ['Memorize tables only', 'Use visual arrays and patterns', 'Skip it', 'Drill daily for 2 hours'], ans: 1 },
      { q: 'Active recall is:', opts: ['Rereading notes', 'Testing yourself on material to strengthen memory', 'Highlighting text', 'Watching videos'], ans: 1 },
      { q: 'A student says "I\'m dumb, I can\'t do math." The mentor should:', opts: ['Agree and move on', 'Challenge the belief and show small wins', 'Ignore the comment', 'Change the subject immediately'], ans: 1 },
      { q: 'Formative assessment means:', opts: ['Final exams only', 'Ongoing check-ins during learning', 'Standardized testing', 'Parent reports'], ans: 1 },
      { q: 'What is the best way to build reading fluency?', opts: ['Silent reading only', 'Repeated reading of familiar texts', 'Reading only new books', 'Skipping difficult words'], ans: 1 },
      { q: 'A student consistently forgets homework. The mentor should:', opts: ['Punish them', 'Explore barriers and create a system together', 'Stop assigning homework', 'Report to NGO immediately'], ans: 1 },
    ],
  },
  {
    id: 'track-13-19',
    ageGroup: '13-19',
    title: 'Adolescent Learning (Ages 13–19)',
    description: 'Academic mentoring, life skills, goal setting, and career readiness for teens',
    color: 'bg-blue-50 border-blue-200',
    accent: 'text-blue-600',
    questions: [
      { q: 'The primary developmental task of adolescence is:', opts: ['Learning to read', 'Identity formation', 'Motor skill development', 'Object permanence'], ans: 1 },
      { q: 'A teen who challenges everything the mentor says is likely:', opts: ['Disrespectful', 'Asserting autonomy, which is developmentally normal', 'Unintelligent', 'In need of punishment'], ans: 1 },
      { q: 'Best approach for a teen who has lost motivation:', opts: ['Threatening consequences', 'Connecting learning to their own goals and interests', 'Ignoring the issue', 'More homework'], ans: 1 },
      { q: 'Self-regulated learning includes:', opts: ['Only following instructions', 'Planning, monitoring, and adjusting one\'s own learning', 'Memorization only', 'Waiting for the mentor to decide everything'], ans: 1 },
      { q: 'A 16-year-old discloses family stress affecting their studies. The mentor should:', opts: ['Ignore personal issues', 'Listen empathetically, then connect to appropriate support', 'Share their own problems', 'End the session'], ans: 1 },
      { q: 'Metacognition means:', opts: ['Learning through movement', 'Thinking about your own thinking and learning', 'Social learning only', 'Memorizing facts'], ans: 1 },
      { q: 'For board exam preparation, the most effective strategy is:', opts: ['Cramming the night before', 'Spaced repetition over weeks', 'Reading once slowly', 'Group socializing only'], ans: 1 },
      { q: 'A teen says they want to drop out of school. The mentor should first:', opts: ['Agree it might be fine', 'Understand their reasons without judgment', 'Scold them', 'Immediately call parents'], ans: 1 },
      { q: 'Life skills mentoring for teens should focus on:', opts: ['Obedience only', 'Decision-making, communication, and emotional regulation', 'Only academic subjects', 'Physical fitness'], ans: 1 },
      { q: 'Peer influence in adolescence is:', opts: ['Always negative', 'Always positive', 'Normal and can be channeled positively', 'Irrelevant to learning'], ans: 1 },
    ],
  },
];

export default function TrainMentorPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    getAllMentors().then(m => { setMentors(m); setLoading(false); });
  }, []);

  const mentor = mentors.find(m => m.id === selectedMentor);

  const startQuiz = (moduleId: string) => {
    setActiveModule(moduleId);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const submitQuiz = async () => {
    const mod = TRAINING_MODULES.find(m => m.id === activeModule);
    if (!mod || !mentor) return;
    let score = 0;
    mod.questions.forEach((q, i) => { if (quizAnswers[i] === q.ans) score++; });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score >= 7) {
      const updated = [...(mentor.trainedModules || [])];
      if (!updated.includes(activeModule!)) updated.push(activeModule!);
      await updateMentor(mentor.id, { trainedModules: updated });
      setMentors(prev => prev.map(m => m.id === mentor.id ? { ...m, trainedModules: updated } : m));
    }
  };

  const activeModuleData = TRAINING_MODULES.find(m => m.id === activeModule);

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Train Mentors</h1>
        <p className="text-gray-500 text-sm mt-1">Age-band training tracks with quiz certification</p>
      </div>

      {/* Mentor selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Mentor</label>
        <select
          value={selectedMentor}
          onChange={e => { setSelectedMentor(e.target.value); setActiveModule(null); }}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="">-- Choose a mentor --</option>
          {mentors.map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
          ))}
        </select>
      </div>

      {/* Training tracks */}
      {TRAINING_MODULES.map(mod => {
        const trained = mentor?.trainedModules?.includes(mod.id);
        const isActive = activeModule === mod.id;

        return (
          <div key={mod.id} className={`rounded-2xl border-2 p-5 mb-4 ${mod.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {trained ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <h3 className={`font-semibold ${mod.accent}`}>{mod.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{mod.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {trained && (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                    ✓ Certified
                  </span>
                )}
                {selectedMentor && (
                  <button
                    onClick={() => isActive ? setActiveModule(null) : startQuiz(mod.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition ${
                      isActive ? 'bg-gray-200 text-gray-700' : `bg-white ${mod.accent} border border-current hover:opacity-80`
                    }`}
                  >
                    {isActive ? <><ChevronUp className="w-4 h-4" /> Close</> : <><PlayCircle className="w-4 h-4" /> Take Quiz</>}
                  </button>
                )}
              </div>
            </div>

            {/* Quiz */}
            {isActive && activeModuleData && (
              <div className="mt-5 pt-5 border-t border-gray-200">
                {!quizSubmitted ? (
                  <>
                    <p className="text-sm font-semibold text-gray-700 mb-4">
                      Answer all 10 questions. Score ≥ 7/10 to pass.
                    </p>
                    <div className="space-y-5">
                      {activeModuleData.questions.map((q, qi) => (
                        <div key={qi} className="bg-white rounded-xl p-4 shadow-sm">
                          <p className="text-sm font-medium text-gray-800 mb-3">
                            {qi + 1}. {q.q}
                          </p>
                          <div className="space-y-2">
                            {q.opts.map((opt, oi) => (
                              <label key={oi} className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                                quizAnswers[qi] === oi ? 'bg-indigo-50 border border-indigo-300' : 'hover:bg-gray-50 border border-transparent'
                              }`}>
                                <input type="radio" name={`q-${qi}`} checked={quizAnswers[qi] === oi}
                                  onChange={() => setQuizAnswers(a => ({ ...a, [qi]: oi }))}
                                  className="text-indigo-600" />
                                <span className="text-sm text-gray-700">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={submitQuiz}
                      disabled={Object.keys(quizAnswers).length < 10}
                      className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-40 transition"
                    >
                      Submit Quiz
                    </button>
                  </>
                ) : (
                  <div className={`text-center py-6 ${quizScore >= 7 ? 'text-green-700' : 'text-red-600'}`}>
                    <div className="text-5xl font-bold mb-2">{quizScore}/10</div>
                    {quizScore >= 7 ? (
                      <>
                        <p className="text-lg font-semibold">🎉 Passed! Mentor is now certified.</p>
                        <p className="text-sm text-gray-500 mt-1">Badge awarded to mentor profile.</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-semibold">Did not pass. Score must be ≥ 7/10.</p>
                        <button onClick={() => startQuiz(mod.id)}
                          className="mt-3 px-5 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">
                          Retake Quiz
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
