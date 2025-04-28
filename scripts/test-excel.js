const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../data/gcse-summer-2025-final.xlsx');
console.log('Reading file:', filePath);

const workbook = XLSX.readFile(filePath);
console.log('Sheets:', workbook.SheetNames);

const sheet = workbook.Sheets['All papers'];
const data = XLSX.utils.sheet_to_json(sheet);
console.log('First row:', JSON.stringify(data[0], null, 2));
console.log('Total rows:', data.length); 