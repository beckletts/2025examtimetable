import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import theme from './theme';

interface Exam {
  qualification: string;
  subject: string;
  paper: string;
  date: string;
  time: string;
  duration: string;
}

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [qualification, setQualification] = useState('');
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qualifications = [
    'GCSE',
    'GCE',
    'International GCSE',
    'BTEC',
    'T-Levels',
    'Edexcel Awards',
    'Level 2 Extended Maths',
    'Level 3 Core'
  ];

  const handleSearch = async () => {
    if (!qualification) {
      setError('Please select a qualification');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/search?qualification=${encodeURIComponent(qualification)}&searchTerm=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch exam data');
      }

      const data = await response.json();
      setExams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching exam data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.pearson.secondary,
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              backgroundColor: 'white',
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{ 
                color: theme.palette.pearson.primary,
                borderBottom: `4px solid ${theme.palette.pearson.accentBlue}`,
                pb: 2,
                mb: 4
              }}
            >
              Pearson Exam Calendar
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Qualification</InputLabel>
                  <Select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    label="Qualification"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.pearson.accentGreen,
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.pearson.accentBlue,
                      },
                    }}
                  >
                    {qualifications.map((qual) => (
                      <MenuItem key={qual} value={qual}>
                        {qual}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Search by subject or paper"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.pearson.accentGreen,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.pearson.accentBlue,
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                backgroundColor: theme.palette.pearson.primary,
                '&:hover': {
                  backgroundColor: theme.palette.pearson.accentBlue,
                },
                mb: 4,
              }}
            >
              Search Exams
            </Button>

            {/* Results will be displayed here */}
            {loading && (
              <Typography sx={{ mt: 4, color: theme.palette.pearson.primary }}>
                Loading exam data...
              </Typography>
            )}

            {error && (
              <Typography sx={{ mt: 4, color: 'error.main' }}>
                {error}
              </Typography>
            )}

            {!loading && !error && exams.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{
                    color: theme.palette.pearson.accentBlue,
                    mb: 3,
                  }}
                >
                  Search Results
                </Typography>
                <Grid container spacing={2}>
                  {exams.map((exam, index) => (
                    <Grid item xs={12} key={index}>
                      <Card 
                        variant="outlined"
                        sx={{
                          borderColor: theme.palette.pearson.accentGreen,
                          '&:hover': {
                            borderColor: theme.palette.pearson.accentBlue,
                            boxShadow: 1,
                          },
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" color={theme.palette.pearson.primary}>
                            {exam.subject}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            Paper: {exam.paper}
                          </Typography>
                          <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
                            <Chip 
                              label={`Date: ${exam.date}`}
                              sx={{ backgroundColor: theme.palette.pearson.accentYellow, color: 'black' }}
                            />
                            <Chip 
                              label={`Time: ${exam.time}`}
                              sx={{ backgroundColor: theme.palette.pearson.accentBlue, color: 'white' }}
                            />
                            <Chip 
                              label={`Duration: ${exam.duration}`}
                              sx={{ backgroundColor: theme.palette.pearson.accentGreen, color: 'white' }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Quick links section */}
            <Box sx={{ mt: 4, pt: 3, borderTop: `2px solid ${theme.palette.pearson.accentYellow}` }}>
              <Typography variant="h5" gutterBottom sx={{ color: theme.palette.pearson.accentGreen }}>
                Popular Searches
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label="Mathematics" 
                  onClick={() => setSearchTerm('Mathematics')}
                  sx={{ 
                    backgroundColor: theme.palette.pearson.accentBlue,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.pearson.accentGreen,
                    }
                  }}
                />
                <Chip 
                  label="English" 
                  onClick={() => setSearchTerm('English')}
                  sx={{ 
                    backgroundColor: theme.palette.pearson.accentGreen,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: theme.palette.pearson.accentBlue,
                    }
                  }}
                />
                <Chip 
                  label="Science" 
                  onClick={() => setSearchTerm('Science')}
                  sx={{ 
                    backgroundColor: theme.palette.pearson.accentYellow,
                    color: 'black',
                    '&:hover': {
                      backgroundColor: theme.palette.pearson.accentBlue,
                      color: 'white',
                    }
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App; 