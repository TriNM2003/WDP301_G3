
import { useContext } from 'react';
import './App.css';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import { Layout } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import AppHeader from './components/Common/AppHeader'
import Home from './components/Home/Home'
import HomePage from './pages/Home/HomePage'
import Welcome from './components/Home/Welcome'
import ProjectList from './pages/Projects/ProjectList';
import ProjectListLayout from './components/Projects/Layout/ProjectListLayout';
import ProjectLayout from './components/Projects/Layout/ProjectLayout';
import Summary from './components/Projects/Detail/Summary';
import SprintBoard from './components/Projects/Detail/Sprint/SprintBoard';
import KanbanBoard from './components/Projects/Detail/Kanban/KanbanBoard';
import ManageProjectLayout from './components/Projects/Layout/ManageProjectLayout';
import ManageProjectMember from './components/Projects/ManageProjectMember';
import EditProject from './components/Projects/EditProject';
import ManageTeams from './components/Teams/ManageTeams';
import ManageSiteMembers from './components/Sites/ManageSiteMembers';
import ManageInvitations from './components/Sites/ManageInvitations';
import ManageProjects from './components/Sites/ManageProjects';
import { cyan } from '@ant-design/colors';
import Login from './pages/Auth/Login';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ActiveAccount from './pages/Auth/ActiveAccount';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import ErrorPage from './pages/Error/ErrorPage';
import E404 from './components/Error/E404';
import RestoreProject from './components/Projects/ProjectTrash';
import EditSite from './components/Sites/EditSite';
import P_id from './pages/Projects/_id';
import TeamList from './pages/Teams/TeamList';
import TeamPerformance from './pages/Teams/TeamPerformance';
import TeamMemberManagement from './components/Teams/TeamMemberManagement';
import TeamMemberPerformance from './pages/Teams/TeamMemberPerformance';
import ProtectedRoute from './utils/ProtectedRoute';
import UserProfile from './pages/Users/UserProfile';
import ViewProfile from './components/Users/ViewProfile';
import ChangePassword from './components/Users/ChangePassword';
import EditProfile from './components/Users/EditProfile';
import ConfirmDelete from './components/Users/ConfirmDelete';
import S_id from './pages/Sites/_id';
import SitePage from './pages/Sites/SitePage';
import ManageSites from './pages/Sites/ManageSites';
import CreateSite from './pages/Sites/CreateSite';
import ProcessingInvitation from './pages/Sites/ProcessingInvitation';

function App() {


  const { accessToken } = useContext(AppContext)


  return (
    <div className="App">
      <Layout>
        <Header style={{ padding: "0", borderBottom: `solid 1px ${cyan[`1`]}` }}>
          <AppHeader/>
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

            {/* xu ly invitation ko can dang nhap */}
            <Route path="/processing-invitation" element={<ProcessingInvitation />} />

          </Routes>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
