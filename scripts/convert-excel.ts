import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

interface ExamData {
  [qualification: string]: {
    exams: Array<{
      date: string;
      examCode: string;
      subject: string;
      title: string;
      time: string;
      duration: string;
    }>;
  };
}

// Function to convert Excel date number to formatted date string
const excelDateToString = (excelDate: number): string => {
  try {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  } catch (error) {
    console.error('Error converting Excel date:', error);
    return '';
  }
};

const processExcelFile = (filePath: string, qualification: string) => {
  try {
    console.log(`\nProcessing ${qualification} data from ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File does not exist: ${filePath}`);
    }

    const workbook = XLSX.readFile(filePath);
    console.log('Available sheets:', workbook.SheetNames);
    
    const allPapersSheet = workbook.SheetNames.find(name => 
      name.toLowerCase().includes('all papers') || 
      name.toLowerCase() === 'allpapers'
    );

    if (!allPapersSheet) {
      console.error('Sheet containing "all papers" not found. Available sheets:', workbook.SheetNames);
      // Try the first sheet as fallback
      console.log('Trying first sheet as fallback:', workbook.SheetNames[0]);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(sheet);
      console.log('Sample row from first sheet:', data[0]);
      return [];
    }

    console.log('Using sheet:', allPapersSheet);
    const sheet = workbook.Sheets[allPapersSheet];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    if (data.length === 0) {
      console.error('No data found in sheet');
      return [];
    }

    console.log('Sample row:', data[0]);
    
    const processed = data.map((row: any) => ({
      date: typeof row.Date === 'number' ? excelDateToString(row.Date) : row.Date,
      examCode: row['Examination code'] || row['Exam code'] || row.Code || '',
      subject: row.Subject || '',
      title: row.Title || row['Paper Title'] || row.Paper || '',
      time: row.Time || row.Session || '',
      duration: row.Duration || ''
    }));

    console.log(`Processed ${processed.length} exams`);
    return processed;
  } catch (error) {
    console.error('Error processing file:', filePath, error);
    return [];
  }
};

// File mapping
const fileMap = {
  "GCSE": "gcse-summer-2025-final.xlsx",
  "GCE": "gce-summer-2025-final.xlsx",
  "International GCSE": "int-gcse-summer-2025-final.xlsx",
  "BTEC": "BTEC-Summer-2025-Final-Timetable .xlsx",
  "T-Levels": "t-levels-summer-2025-final-timetable.xlsx",
  "Edexcel Awards": "edexcel-awards-summer-2025-final.xlsx",
  "Level 2 Extended Maths": "l2-extended-maths-summer-2025-final.xlsx",
  "Level 3 Core": "l3-core-summer-2025-final.xlsx"
};

try {
  // Initialize data structure
  const examData: ExamData = Object.keys(fileMap).reduce((acc, qual) => {
    acc[qual] = { exams: [] };
    return acc;
  }, {} as ExamData);

  // Process all files
  Object.entries(fileMap).forEach(([qualification, filename]) => {
    const filePath = path.join(__dirname, '../data', filename);
    examData[qualification].exams = processExcelFile(filePath, qualification);
  });

  // Save to JSON file
  const outputPath = path.join(__dirname, '../data/exam-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(examData, null, 2));
  console.log('\nData saved to:', outputPath);
} catch (error) {
  console.error('Error in main process:', error);
} 