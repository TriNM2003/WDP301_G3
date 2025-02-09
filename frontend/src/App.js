import logo from './logo.svg';
import './App.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ErrorPage from './pages/Error/ErrorPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserProfile from './pages/Users/UserProfile';
import EditProfile from './components/Users/EditProfile';
import ManageProfile from './components/Users/ManageProfile';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} >
          <Route path="manage-profile" element={<ManageProfile />} >
            <Route path="edit-profile" element={<EditProfile/>} />
          </Route>
        </Route>

        <Route path="/change-password" element={<Register />} />

        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
