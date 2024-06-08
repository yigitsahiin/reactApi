import './App.css';
import { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Stack,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { Loading } from './assets/loading';
import { hackerrankAPI, jsonPlaceholderAPI } from '../api/axios';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('football');
  const [selectedYear, setSelectedYear] = useState(2011);
  const [postData, setPostData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const numberInputRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        let result;
        if (selectedOption === 'football') {
          result = await hackerrankAPI.get(`football_competitions?year=${selectedYear}`);
          setData(result.data.data); 
        } else if (selectedOption === 'posts') {
          setData([]); 
          setPostData(null); 
        }
      } catch (error) {
        console.error(error.message ?? error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
    fetchData();
  }, [selectedOption, selectedYear]);

  const fetchPostById = async () => {
    const postId = numberInputRef.current.value;
    if (postId <= 0 || postId > 100) {
      setErrorMessage('Girdiğiniz değerde post bulunmamaktadır');
      setPostData(null);
      return;
    }
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await jsonPlaceholderAPI.get(`posts/${postId}`);
      setPostData(result.data);
    } catch (error) {
      console.error(error.message ?? error);
      setErrorMessage('Girdiğiniz değerde post bulunmamaktadır');
      setPostData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container maxWidth='lg'>
        <Box sx={{ flexGrow: 1 }}>
          {isLoading && <Loading />}
          {!isLoading && (
            <Stack gap={5}>
              <FormControl fullWidth>
                <InputLabel id='option-select-label'>Data Seçimi</InputLabel>
                <Select
                  labelId='option-select-label'
                  id='option-select'
                  value={selectedOption}
                  label='Select Option'
                  onChange={(event) => setSelectedOption(event.target.value)}
                >
                  <MenuItem value='football'>Football Datası</MenuItem>
                  <MenuItem value='posts'>Posts Datası</MenuItem>
                </Select>
              </FormControl>
              {selectedOption === 'football' && (
                <FormControl fullWidth>
                  <InputLabel id='year-select-label'>Yıl Seçimi</InputLabel>
                  <Select
                    labelId='year-select-label'
                    id='year-select'
                    value={selectedYear}
                    label='Select Year'
                    onChange={(event) => setSelectedYear(event.target.value)}
                  >
                    {[2011, 2012, 2013, 2014, 2015, 2016].map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {selectedOption === 'posts' && (
                <Stack direction="row" spacing={2}>
                  <TextField
                    inputRef={numberInputRef}
                    label="Post Numarası Giriniz"
                    variant="outlined"
                    type="number"
                  />
                  <Button variant="contained" onClick={fetchPostById}>Post Getir</Button>
                </Stack>
              )}
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}
            </Stack>
          )}
        </Box>
      </Container>
      <Container maxWidth="md">
        <Box mt={2}>
          {selectedOption === 'football' && data && (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Organizasyon</TableCell>
                    <TableCell align="right">Ülke</TableCell>
                    <TableCell align="right">Yıl</TableCell>
                    <TableCell align="right">Kazanan</TableCell>
                    <TableCell align="right">İkincilik</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((competition, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">{competition.name}</TableCell>
                      <TableCell align="right">{competition.country || 'Unknown'}</TableCell>
                      <TableCell align="right">{competition.year}</TableCell>
                      <TableCell align="right">{competition.winner}</TableCell>
                      <TableCell align="right">{competition.runnerup}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {selectedOption === 'posts' && postData && (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Post Numarası</TableCell>
                    <TableCell>Başlık</TableCell>
                    <TableCell>Açıklama</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{postData.id}</TableCell>
                    <TableCell>{postData.title}</TableCell>
                    <TableCell>{postData.body}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;
