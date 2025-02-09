import logo from './logo.svg';
import './App.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ErrorPage from './pages/Error/ErrorPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserProfile from './pages/Users/UserProfile';
import ChangePassword from './components/Users/ChangePassword';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} >
          <Route path="change-password" element={<ChangePassword />} />
          <Route path="edit-profile" element={<Register />} >
          </Route>
        </Route>



        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
