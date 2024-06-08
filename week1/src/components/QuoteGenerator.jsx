
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuoteGenerator.css';
import { TextField, Button, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

function QuoteGenerator() {
  const [quotes, setQuotes] = useState([]);
  const [randomQuote, setRandomQuote] = useState('“The future depends on what we do in the present.”');
  const [author, setAuthor] = useState('Mahatma Gandhi');
  const [searchValue, setSearchValue] = useState('');

  const options = {
    method: 'GET',
    url: 'https://type.fit/api/quotes',
  };

  const generateQuotes = async () => {
    try {
      const response = await axios.request(options);
      setQuotes(response.data);
      generateRandomQuote(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const generateRandomQuote = (quotesArray) => {
    const randomIndex = Math.floor(Math.random() * quotesArray.length);
    const randomQuote = quotesArray[randomIndex];
    setRandomQuote(randomQuote.text);
    setAuthor(cleanAuthor(randomQuote.author));
  };

  const handleSearch = () => {
    const filteredQuotes = quotes.filter((quote) =>
      quote.author && quote.author.toLowerCase().includes(searchValue.toLowerCase())
    );
    if (filteredQuotes.length > 0) {
      setRandomQuote(filteredQuotes[0].text);
      setAuthor(cleanAuthor(filteredQuotes[0].author));
      setSearchValue('');
    } else {
      setRandomQuote('No quotes found for this author');
      setAuthor('');
    }
  };

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const cleanAuthor = (author) => {
    if (!author) return 'Unknown';
    return author.split(',')[0].trim();
  };

  useEffect(() => {
    generateQuotes();
  }, []);

  return (
    <div className="container">
      <div className="quote-container">
        <h2 className="quote">{randomQuote}</h2>
        <p className="author">- {author}</p>
        <hr className="divider"/>
        <div className='author-search'>
          <TextField
            id="filled-search"
            label="Search by author"
            type="search"
            value={searchValue}
            onChange={handleChange}
            variant="filled"
          />
          &nbsp; &nbsp; 
          <Button onClick={handleSearch} variant="outlined">
            Search
          </Button>
          &nbsp; &nbsp; 
          <IconButton onClick={() => generateRandomQuote(quotes)} aria-label="refresh">
            <RefreshIcon />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default QuoteGenerator;
