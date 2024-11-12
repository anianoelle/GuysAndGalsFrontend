import { useEffect, useState } from 'react'
import './App.css'
import './output.css';
import { BrowserRouter } from 'react-router-dom';
import Pages from './Pages/Pages';


function App() {    
  

  return (
   <div>
      <BrowserRouter>
          <Pages></Pages>
      </BrowserRouter>
   </div>
  )
}

export default App
