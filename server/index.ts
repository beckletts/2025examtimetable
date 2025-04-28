const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

interface Exam {
  qualification: string;
  subject: string;
  paper: string;
  date: string;
  time: string;
  duration: string;
}

const fileNameMap: { [key: string]: string } = {
  'GCSE': 'gcse-summer-2025-final.xlsx',
  'GCE': 'gce-summer-2025-final.xlsx',
  'International GCSE': 'int-gcse-summer-2025-final.xlsx',
  'BTEC': 'BTEC-Summer-2025-Final-Timetable .xlsx',
  'T-Levels': 't-levels-summer-2025-final-timetable.xlsx',
  'Edexcel Awards': 'edexcel-awards-summer-2025-final.xlsx',
  'Level 2 Extended Maths': 'l2-extended-maths-summer-2025-final.xlsx',
  'Level 3 Core': 'l3-core-summer-2025-final.xlsx'
};

// Function to convert Excel date number to formatted date string
const excelDateToString = (excelDate: number): string => {
  // Excel dates are number of days since December 30, 1899
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const processExcelFile = (filePath: string, qualification: string): Exam[] => {
  try {
    console.log('Reading file:', filePath);
    const workbook = XLSX.readFile(filePath);
    
    // Get all sheet names and find the one that matches 'all papers' case-insensitively
    const sheetNames = workbook.SheetNames;
    console.log('Available sheets:', sheetNames);
    
    const allPapersSheet = sheetNames.find((name: string) => 
      name.toLowerCase().includes('all papers') || 
      name.toLowerCase().includes('allpapers')
    );

    if (!allPapersSheet) {
      console.error('Sheet containing "all papers" not found. Available sheets:', sheetNames);
      return [];
    }

    console.log('Using sheet:', allPapersSheet);
    const sheet = workbook.Sheets[allPapersSheet];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    console.log('Raw data sample:', data[0]);
    
    return data.map((row: any) => {
      // Get the paper title from either Title or Paper field
      const paperTitle = row.Title || row['Paper Title'] || row.Paper || '';
      
      // Convert Excel date number to string if it's a number
      const dateValue = typeof row.Date === 'number' ? excelDateToString(row.Date) : row.Date || '';
      
      // Format duration to include 'h' and 'm' if they're missing
      let duration = row.Duration || '';
      if (duration && !duration.includes('h') && !duration.includes('m')) {
        const [hours, minutes] = duration.split('.');
        duration = `${hours}h ${minutes || '00'}m`;
      }

      return {
        qualification,
        subject: row.Subject || '',
        paper: paperTitle,
        date: dateValue,
        time: row.Time || '',
        duration: duration
      };
    });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    return [];
  }
};

app.get('/api/search', (req: any, res: any) => {
  const qualification = String(req.query.qualification || '');
  const searchTerm = String(req.query.searchTerm || '');
  
  if (!qualification) {
    return res.status(400).json({ error: 'Qualification is required' });
  }

  try {
    const fileName = fileNameMap[qualification];
    if (!fileName) {
      return res.status(400).json({ error: 'Invalid qualification' });
    }

    const filePath = path.join(__dirname, '../data', fileName);
    console.log('Attempting to read file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return res.status(404).json({ error: 'Exam data file not found' });
    }

    const exams = processExcelFile(filePath, qualification);
    console.log(`Found ${exams.length} exams`);
    
    if (exams.length === 0) {
      return res.status(500).json({ error: 'No exam data found in the file' });
    }

    const filteredExams = searchTerm
      ? exams.filter(exam => 
          exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.paper.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : exams;
    
    console.log(`Returning ${filteredExams.length} filtered exams`);
    res.json(filteredExams);
  } catch (error) {
    console.error('Error processing search:', error);
    res.status(500).json({ error: 'Error processing search request' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('Available qualifications:', Object.keys(fileNameMap).join(', '));
}); 