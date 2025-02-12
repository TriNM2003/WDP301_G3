import logo from './logo.svg';
import './App.css';
import { Outlet, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ErrorPage from './pages/Error/ErrorPage';
import Login from './pages/Auth/Login';
import UserProfile from './pages/Users/UserProfile';
import ActiveAccount from './pages/Auth/ActiveAccount';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

import ChangePassword from './components/Users/ChangePassword';


import EditProfile from './components/Users/EditProfile';
import ManageProfile from './components/Users/ManageProfile';

import ViewProfile from './components/Users/ViewProfile';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { useContext } from 'react';
import { AppContext } from './context/AppContext';


function App() {
  const {accessToken} = useContext(AppContext);
  return (
    <div className="App">
      <Routes>
        <Route path="/home" element={<HomePage />} />

        {accessToken === null && 
        <Route path='/auth' element={<Login />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
        </Route>}
        

        <Route path="/active-account" element={<ActiveAccount/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/reset-password" element={<ResetPassword/>} />
          
        <Route path="/profile" element={<UserProfile />} >
          <Route path="profile-info" element={<ViewProfile />} />
          <Route path="manage-profile" element={<ManageProfile />} >
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="edit-profile" element={<EditProfile/>} />
          </Route>
        </Route>




        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
