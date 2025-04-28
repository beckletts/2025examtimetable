# Pearson Exam Calendar 2025

A web interface for searching Pearson exam dates and details. This application allows users to search through various qualification exam timetables for summer 2025.

## Features

- Search exams by qualification and subject/paper
- View exam dates, times, and durations
- Modern, responsive interface using Pearson's brand colors
- Real-time search functionality
- Support for multiple qualifications:
  - GCSE
  - GCE
  - International GCSE
  - BTEC
  - T-Levels
  - Edexcel Awards
  - Level 2 Extended Maths
  - Level 3 Core

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/beckletts/2025examtimetable.git
   cd 2025examtimetable
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   # In one terminal, start the frontend
   npm start
   ```

4. In a separate terminal, start the backend server:
   ```bash
   npm run server
   ```

The application will be available at `http://localhost:3000`

## Project Structure

- `src/` - Frontend React application
  - `App.tsx` - Main application component
  - `theme.ts` - Pearson brand theme configuration
- `server/` - Backend Express server
  - `index.ts` - API endpoints and Excel file processing
- `data/` - Excel files containing exam timetables
- `public/` - Static assets

## Technologies Used

- React with TypeScript
- Material-UI for components
- Express.js backend
- XLSX for Excel file processing

## Color Scheme

- Primary Purple: #5B2D86
- Secondary Amethyst: #9B5FC0
- Accent Colors:
  - Blue: #0077C8
  - Green: #00A99D
  - Yellow: #FFD100

## Font

- Plus Jakarta Sans

## API Endpoints

### GET /api/search
Search for exams with optional filtering:
- `qualification`: Required. The qualification to search (e.g., "GCSE")
- `searchTerm`: Optional. Search term to filter by subject or paper title

Example:
```
GET http://localhost:3001/api/search?qualification=GCSE&searchTerm=Mathematics
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request 