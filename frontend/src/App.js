import logo from './logo.svg';
import './App.css';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import ErrorPage from './pages/Error/ErrorPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import UserProfile from './pages/Users/UserProfile';
import ActiveAccount from './pages/Auth/ActiveAccount';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

import ChangePassword from './components/Users/ChangePassword';


import EditProfile from './components/Users/EditProfile';
import ManageProfile from './components/Users/ManageProfile';

import ViewProfile from './components/Users/ViewProfile';
import ProtectedRoute from './utils/ProtectedRoute';
import Home from './components/Home/Home';
import Welcome from './components/Home/Welcome';
import { AppContext } from './context/AppContext';
import { useContext } from 'react';
import { Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import AppHeader from './components/Common/AppHeader';
import E404 from './components/Error/E404';
import E403 from './components/Error/E403';


function App() {
  const { accessToken } = useContext(AppContext)


  return (
    <div className="App">
      <Layout>
        <Header style={{ padding: "0" }}>
          <AppHeader />
        </Header>
        <Content>
          <Routes>
            {!accessToken && <>
              <Route path='/home' element={<HomePage />}>
                <Route path='' element={<Welcome />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/active-account" element={<ActiveAccount />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<ErrorPage />}>
                <Route path='*' element={<E404 />} />
              </Route>
            </>}

            <Route element={<ProtectedRoute />}>
              <Route path='/home' element={<HomePage />}>
                <Route path='' element={<Home />} />
              </Route>
              <Route path="/profile" element={<UserProfile />} >
                <Route path="profile-info" element={<ViewProfile />} />
                <Route path="manage-profile" element={<ManageProfile />} >
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="edit-profile" element={<EditProfile />} />
                </Route>
              </Route>
              <Route path='*' element={<Navigate to="/home" />} />
            </Route>


          </Routes>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
