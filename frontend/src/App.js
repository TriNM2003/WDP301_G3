import logo from './logo.svg';
import './App.css';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
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
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProjectList from './pages/Project/ProjectList';
import TeamList from './pages/Team/TeamList';
import S_id from './pages/Sites/_id';
import P_id from './pages/Projects/_id';
import { cyan } from '@ant-design/colors';
import Summary from './components/Project/Detail/Summary';
import SprintBoard from './components/Project/Detail/SprintBoard';
import KanbanBoard from './components/Project/Detail/Kanban/KanbanBoard';
import { Button } from 'antd';
import axios from 'axios';
import authAxios from './utils/authAxios';
import ManageSiteMembers from './components/Site/ManageSiteMembers';

import SitePage from './pages/Site/SitePage';
import ManageProjects from './components/Site/ManageProjects';




function App() {


  const { accessToken } = useContext(AppContext)


  return (
    <div className="App">
      <Layout>
        <Header style={{ padding: "0", borderBottom:`solid 1px ${cyan[`1`]}` }}>
          <AppHeader />
        </Header>
        <Content>
          <Routes>
          {!accessToken && <>
              <Route path='/home' element={<HomePage />}>
                <Route index element={<Welcome />} />
              </Route>
              <Route path='/auth' element={<Login />}>
                <Route path="login" element={<LoginForm />} />
                <Route path="register" element={<RegisterForm />} />
              </Route>
              <Route path="/active-account" element={<ActiveAccount />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<ErrorPage />}>
                <Route path='*' element={<E404 />} />
              </Route>
            </>}

            <Route element={<ProtectedRoute />}>
              <Route path='/home' element={<HomePage />}>
                <Route index element={<Home />} />
              </Route>
              <Route path="/profile" element={<UserProfile />} >
                <Route path="profile-info" element={<ViewProfile />} />
              
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="edit-profile" element={<EditProfile />} />
                </Route>

                <Route path="site" element={<S_id/>} >
                  <Route index element={<SitePage />} />
                  <Route path="site-page" element={<SitePage /> } />
                  <Route path='manage-projects' element={<ManageProjects />} />
                  <Route path='manage-members' element={<ManageSiteMembers />} />
                  <Route path="projects" element={<ProjectList />} />
                  <Route path="teams" element={<TeamList />} />              
                  <Route path='project' element={<P_id/>}>
                    <Route index element={<Summary />} />
                    <Route path='summary' element={<Summary/>}/>
                    <Route path='sprint' element={<SprintBoard/>}/>
                    <Route path='board' element={<KanbanBoard/>}/>

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
