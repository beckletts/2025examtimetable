import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

interface Exam {
  date: string;
  examCode: string;
  subject: string;
  title: string;
  time: string;
  duration: string;
}

interface QualificationData {
  exams: Exam[];
}

interface ExamData {
  [qualification: string]: QualificationData;
}

const app = express();
app.use(cors());
app.use(express.json());

// Load exam data from JSON file
const examDataPath = path.join(__dirname, '../data/exam-data.json');
const examData: ExamData = JSON.parse(fs.readFileSync(examDataPath, 'utf-8'));

app.get('/api/search', (req, res) => {
  try {
    const qualification = req.query.qualification as string;
    const searchTerm = (req.query.searchTerm as string || '').toLowerCase();
    
    if (!qualification) {
      return res.status(400).json({ error: 'Qualification is required' });
    }

    const qualificationData = examData[qualification];
    if (!qualificationData) {
      return res.status(404).json({ error: 'Qualification not found' });
    }

    let filteredExams = qualificationData.exams;
    
    // Apply search filter if searchTerm is provided
    if (searchTerm) {
      filteredExams = filteredExams.filter(exam => 
        exam.subject.toLowerCase().includes(searchTerm) ||
        exam.title.toLowerCase().includes(searchTerm)
      );
    }

    console.log(`Found ${filteredExams.length} exams for ${qualification}`);
    res.json(filteredExams);
  } catch (error) {
    console.error('Error processing search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get available qualifications
app.get('/api/qualifications', (_, res) => {
  res.json(Object.keys(examData));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Available qualifications:', Object.keys(examData).join(', '));
}); 