import { AccountBookFilled, AccountBookOutlined, GroupOutlined, MailOutlined, ProjectFilled, ProjectOutlined, ProjectTwoTone, SettingOutlined, SettingTwoTone, TeamOutlined, UndoOutlined, UserOutlined, MoreOutlined } from '@ant-design/icons';
import { Divider, Menu, Dropdown, Button ,Tooltip} from 'antd'

import Title from 'antd/es/typography/Title'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import SubMenu from 'antd/es/menu/SubMenu';
import { blue, cyan, grey, magenta } from '@ant-design/colors';

function SiteSider() {

  const { defaultSelectedKeys, setDefaultSelectedKeys, site, projects, user, teams } = useContext(AppContext)
  const navigate = useNavigate();

  let isSiteOwner = false;
  if(site){
      isSiteOwner = site?.siteMember?.find(siteMember => siteMember._id === user._id).roles.includes("siteOwner"); 
  }
  

  // Tìm 4 project có thời gian cập nhật gần nhất của tài khoản hiện tại
  const recentProjects = Array.isArray(projects)
    ? projects
      .filter(project => project?.projectStatus === "active" &&  project.projectMember.some(member => member._id?._id === user._id))
      .map(project => ({
        ...project,
        lastUpdated: project?.updatedAt || null
      }))
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 4)
    : [];

  // Tìm 4 teams có thời gian cập nhật gần nhất của tài khoản hiện tại
  const recentTeams = Array.isArray(teams)
    ? teams
      .filter(team =>
        team.teamMembers?.some(member =>
          member._id?._id === user._id && member.roles.includes("teamLeader")
        )
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 4)
    : [];

    

  const handleMenuClick = (e) => {

    setDefaultSelectedKeys(e.key);
  };
  return (
    <>
      <Title level={4} onClick={() => { navigate("/site") }} style={{ cursor: "pointer" }}>{site?.siteName}</Title>
      <Divider />
      <Menu
        mode="inline"
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={['project', 'team']}
        onClick={handleMenuClick}
        inlineIndent={15}

      >
        {/* Projects */}
        <SubMenu key="project" icon={<ProjectTwoTone />} title="Projects">
      <Menu.ItemGroup style={{ textAlign: 'start' }} key="p">
        {recentProjects?.length > 0 ? (
          recentProjects.map((project) => (
            <Menu.Item
              key={`project-${project._id}`}
              icon={<ProjectOutlined style={{ color: magenta[4] }} />}
              onClick={() => navigate(`list/projects/${project.projectSlug}`)}
            >
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tooltip title={project.projectName} placement="top">
                  <span style={{
                    maxWidth: "120px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "inline-block"
                  }}>
                    {project.projectName}
                  </span>
                </Tooltip>

                <Dropdown
                  trigger={['click']}
                  overlay={
                    <Menu onClick={(e) => e.domEvent.stopPropagation()}>
                      <Menu.Item key="add">Add people</Menu.Item>
                      <Menu.Item key="settings" onClick={() => navigate(`/site/list/projects/${project.projectSlug}/project-setting`)}>
                        Project settings
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button
                    type="text"
                    icon={<MoreOutlined />}
                    onClick={(e) => e.stopPropagation()} 
                  />
                </Dropdown>
              </span>
            </Menu.Item>
          ))
        ) : (
          <Menu.Item key="no-projects" disabled>
            No recent projects
          </Menu.Item>
        )}
        <Menu.Item key="pp" onClick={() => navigate('list/projects')}>
          View all projects
        </Menu.Item>
        <Menu.Item key="cycle" onClick={() => navigate('recycle')}>
          <UndoOutlined /> Project trash
        </Menu.Item>
      </Menu.ItemGroup>
    </SubMenu>

        {/* Teams */}
        <SubMenu key="team" icon={<TeamOutlined style={{ color: blue[5] }} />} title="Teams">
  <Menu.ItemGroup style={{ textAlign: "start" }} key="t">
    {recentTeams?.length > 0 ? (
      recentTeams.map((team) => (
        <Menu.Item
          key={`team-${team._id}`}
          icon={<GroupOutlined style={{ color: cyan[4] }} />}
          onClick={() => navigate(`teams/${team.teamSlug}`)}
        >
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tooltip title={team.teamName} placement="top">
              <span style={{
                maxWidth: "120px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "inline-block"
              }}>
                {team.teamName}
              </span>
            </Tooltip>

            <Dropdown
              trigger={['click']}
              overlay={(
                <Menu onClick={(e) => e.domEvent.stopPropagation()}>
                  <Menu.Item key="add">Add people</Menu.Item>
                  <Menu.Item key="settings" onClick={() => navigate(`/site/teams/${team.teamSlug}/manage-member`)}>
                    Manage members
                  </Menu.Item>
                </Menu>
              )}
            >
              <Button type="text" icon={<MoreOutlined />} onClick={(e) => e.stopPropagation()} />
            </Dropdown>
          </span>
        </Menu.Item>
      ))
    ) : (
      <Menu.Item key="no-teams" disabled>
        No recent teams
      </Menu.Item>
    )}
    <Menu.Item key="pt" onClick={() => navigate("list/teams")}>View all teams</Menu.Item>
  </Menu.ItemGroup>
</SubMenu>


        {/* Settings */}
        {isSiteOwner &&
        <SubMenu key="setting" icon={<SettingTwoTone />} title="Settings">
          <Menu.ItemGroup style={{ "text-align": "start" }} key="s" >
            <Menu.Item icon={<SettingOutlined style={{ color: grey[6] }} />} key="s1" onClick={() => { navigate("site-setting") }}>Setting</Menu.Item>
            <Menu.Item icon={<UserOutlined style={{ color: blue[3] }} />} key="s2" onClick={() => { navigate("manage/members") }}>Manage Access</Menu.Item>
            <Menu.Item icon={<ProjectOutlined style={{ color: blue[3] }} />} key="s3" onClick={() => { navigate("manage/projects") }}>Manage Projects</Menu.Item>
            <Menu.Item icon={<TeamOutlined style={{ color: blue[3] }} />} key="s4" onClick={() => { navigate("manage/teams") }}>Manage Teams</Menu.Item>
            <Menu.Item icon={<MailOutlined style={{ color: blue[3] }} />} key="s5" onClick={() => { navigate("manage/invitations") }}>Manage Invitations</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
        }
        
      </Menu>
    </>
  )
}

export default SiteSider
