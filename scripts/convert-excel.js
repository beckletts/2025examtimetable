const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Function to convert Excel date number to formatted date string
const excelDateToString = (excelDate) => {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

const processExcelFile = (filePath) => {
  console.log(`\nProcessing ${filePath}`);
  
  const workbook = XLSX.readFile(filePath);
  console.log('Available sheets:', workbook.SheetNames);
  
  // Get the "All papers" sheet
  const sheet = workbook.Sheets['All papers'];
  if (!sheet) {
    console.error('Sheet "All papers" not found');
    return [];
  }

  const data = XLSX.utils.sheet_to_json(sheet);
  console.log(`Found ${data.length} rows`);
  
  if (data.length === 0) {
    return [];
  }

  console.log('Sample row:', JSON.stringify(data[0], null, 2));
  
  return data.map(row => ({
    date: typeof row.Date === 'number' ? excelDateToString(row.Date) : row.Date,
    examCode: row['Examination code'] || '',
    subject: row.Subject || '',
    title: row.Title || '',
    time: row.Time || '',
    duration: row.Duration || ''
  }));
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

// Initialize data structure
const examData = Object.keys(fileMap).reduce((acc, qual) => {
  acc[qual] = { exams: [] };
  return acc;
}, {});

// Process all files
Object.entries(fileMap).forEach(([qualification, filename]) => {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    if (fs.existsSync(filePath)) {
      examData[qualification].exams = processExcelFile(filePath);
      console.log(`Processed ${examData[qualification].exams.length} ${qualification} exams`);
    } else {
      console.error(`File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${qualification}:`, error);
  }
});

// Save to JSON file
const outputPath = path.join(__dirname, '../data/exam-data.json');
fs.writeFileSync(outputPath, JSON.stringify(examData, null, 2));
console.log('\nData saved to:', outputPath); 