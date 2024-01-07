import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/Home';
import LoginScreen from './pages/LoginRegister/Login';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
