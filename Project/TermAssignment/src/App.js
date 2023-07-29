import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Grid from './Grid';
import './css/App.css'
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Grid />} />
        <Route path="/Register" element={<Register />} />  
        <Route path="/Login" element={<Login />} />
        <Route path="*" element={<Grid/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;