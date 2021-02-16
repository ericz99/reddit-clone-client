import React from 'react';

import NavBar from './components/NavBar';

export default function App({ isAuth, children }) {
  return (
    <div className="h-full w-full relative flex flex-col">
      <NavBar isAuth={isAuth} />
      {children}
    </div>
  );
}
