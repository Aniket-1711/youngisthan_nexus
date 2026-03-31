import socialHistory from '../assets/Social History.mp4';
import effectiveComms from '../assets/effective communications.mp4';
import empathy from '../assets/empathy.mp4';
import trigonometry from '../assets/trignometry.mp4';
import waterCycle from '../assets/water cycle.mp4';

import conceptsEasily from '../assets/mentor courses/explaining complicated concepts easily.mp4';
import teachingTechniques from '../assets/mentor courses/teachingTechniques.mp4';
// Note: filename below has an extra space after 'ways' based on directory list
import studentEngagement from '../assets/mentor courses/ways  to increase student engagement.mp4';

export const commonVideos = [
  { id: 'c1', title: 'Social History', category: 'Humanities', src: socialHistory },
  { id: 'c2', title: 'Effective Communications', category: 'Soft Skills', src: effectiveComms },
  { id: 'c3', title: 'Empathy', category: 'Soft Skills', src: empathy },
  { id: 'c4', title: 'Trigonometry', category: 'Math', src: trigonometry },
  { id: 'c5', title: 'Water Cycle', category: 'Science', src: waterCycle },
];

export const mentorVideos = [
  { id: 'm1', title: 'Explaining Complicated Concepts Easily', category: 'Teaching', src: conceptsEasily },
  { id: 'm2', title: 'Teaching Techniques', category: 'Teaching', src: teachingTechniques },
  { id: 'm3', title: 'Ways to Increase Student Engagement', category: 'Teaching', src: studentEngagement },
];
