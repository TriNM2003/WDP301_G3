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
import RestoreProject from './components/Projects/ProjectTrash';
import TeamMemberManagement from './components/Teams/TeamMemberManagement';
import EditSite from './components/Sites/EditSite';
import ConfirmDelete from './components/Users/ConfirmDelete';
import EditProject from './components/Projects/EditProject';
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
import ProjectList from './pages/Projects/ProjectList';
import TeamList from './pages/Teams/TeamList';
import TeamPerformance from './pages/Teams/TeamPerformance';
import TeamMemberPerformance from './pages/Teams/TeamMemberPerformance';
import S_id from './pages/Sites/_id';
import P_id from './pages/Projects/_id';
import { cyan } from '@ant-design/colors';
import Summary from './components/Project/Detail/Summary';
import KanbanBoard from './components/Project/Detail/Kanban/KanbanBoard';
import { Button } from 'antd';
import axios from 'axios';
import authAxios from './utils/authAxios';
import CreateSite from './pages/Sites/CreateSite';
import ManageProjectMember from './components/Project/ManageProjectMember';
import ManageSiteMembers from './components/Site/ManageSiteMembers';
import SitePage from './pages/Sites/SitePage';
import ManageProjects from './components/Site/ManageProjects';
import ProjectLayout from './components/Project/Layout/ProjectLayout';
import ManageProjectLayout from './components/Project/Layout/ManageProjectLayout';
import ManageTeams from './components/Team/ManageTeams';
import ManageSites from './pages/Sites/ManageSites';
import ManageInvitations from './components/Site/ManageInvitations';
import SprintBoard from './components/Project/Detail/Sprint/SprintBoard';
import ProjectListLayout from './components/Project/Layout/ProjectListLayout';



function App() {


  const { accessToken } = useContext(AppContext)


  return (
    <div className="App">
      <Layout>
        <Header style={{ padding: "0", borderBottom: `solid 1px ${cyan[`1`]}` }}>
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
              <Route path="/profile/confirm-delete" element={<ConfirmDelete />} />
              <Route path="site" element={<S_id />} >
                <Route index element={<SitePage />} />
                <Route path="site-page" element={<SitePage />} />
                <Route path='recycle' element={<RestoreProject />} />
                <Route path="site-setting" element={<EditSite />} />
                <Route path='manage' >
                  <Route index element={<ManageProjects />} />
                  <Route path='projects' element={<ManageProjects />} />
                  <Route path='invitations' element={<ManageInvitations />} />
                  <Route path='members' element={<ManageSiteMembers />} />
                  <Route path='teams' element={<ManageTeams />} />
                </Route>



                <Route path='list'>
                  <Route index element={<ProjectList />} />
                  <Route path="projects" element={<ProjectListLayout />} >
                    <Route index element={<ProjectList />} />
                    <Route path=':projectSlug' element={<P_id />}>
                      <Route path='' element={<ProjectLayout />}  >
                        <Route index element={<Summary />} />
                        <Route path='summary' element={<Summary />} />
                        <Route path='sprint' element={<SprintBoard />} />
                        <Route path='board' element={<KanbanBoard />} />
                      </Route>
                      <Route path='manage' element={<ManageProjectLayout />}>
                        <Route path='members' element={<ManageProjectMember />} />
                      </Route>
                      <Route path="project-setting" element={<EditProject />} />
                    </Route>
                  </Route>

                  <Route path="teams" element={<TeamList />} />
                </Route>

                <Route path='team'>
                  <Route index element={<TeamPerformance />} />
                  <Route path="manage-member" element={<TeamMemberManagement />} />
                  <Route path="performance" element={<TeamPerformance />} />
                  <Route path="member-performance" element={<TeamMemberPerformance />} />
                </Route>


              </Route>

              <Route path='/create-site' element={<CreateSite />} />

              <Route path='/manage-sites' element={<ManageSites />} />

              <Route path='*' element={<Navigate to="/home" />} />
            </Route>

          </Routes>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
