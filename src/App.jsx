import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Tasklist from './components/Tasklist'
import Editshop from './components/Editshop'
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'

const PageNotFound = () => {
  return(
    <div>
    <h1>Page Not Found</h1>
    <Link to={'/'} className='btn btn-info'>Back</Link>
  </div>
  )
}

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<Tasklist/>}/>
        <Route path='edit/:id' element={<Editshop/>}/>
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
