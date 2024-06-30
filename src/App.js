import React from 'react';
import Expenses from './components/Expenses';
import Auth from './components/Auth';

const App = () => {
  return (
      <div>
        <Auth />
        <Expenses />
      </div>
  );
};

export default App;
