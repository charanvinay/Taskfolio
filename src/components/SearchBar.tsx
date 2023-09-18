import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, InputBase, Paper, Stack } from '@mui/material';
import React, { useState } from 'react';
import { ISearchBar } from '../utils/interfaces';

const SearchBar: React.FC<ISearchBar> = ({ placeholder }) => {
  const [searchText, setSearchText] = useState('');
  return (
    <Stack spacing={2} sx={{ marginY: 1 }}>
      <Paper
        elevation={0}
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ flex: 1 }}
          placeholder={placeholder}
          inputProps={{ 'aria-label': placeholder }}
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
        {searchText && (
          <IconButton
            type="button"
            sx={{ p: '10px' }}
            aria-label="search"
            onClick={() => setSearchText('')}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Paper>
    </Stack>
  );
};

export default SearchBar;
