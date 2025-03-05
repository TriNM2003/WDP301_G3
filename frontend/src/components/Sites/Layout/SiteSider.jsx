import { AccountBookFilled, AccountBookOutlined, GroupOutlined, MailOutlined, ProjectFilled, ProjectOutlined, ProjectTwoTone, SettingOutlined, SettingTwoTone, TeamOutlined, UndoOutlined, UserOutlined } from '@ant-design/icons';
import { Divider, Menu } from 'antd'

import Title from 'antd/es/typography/Title'
import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import SubMenu from 'antd/es/menu/SubMenu';
import { blue, cyan, grey, magenta } from '@ant-design/colors';

function SiteSider() {

  const { defaultSelectedKeys, setDefaultSelectedKeys , site} = useContext(AppContext)
  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    console.log(e.key);
    setDefaultSelectedKeys(e.key);
  };
  return (
    <>
      <Title level={4} onClick={()=>{navigate("/site")}} style={{cursor:"pointer"}}>{site?.siteName}</Title>
      <Divider />
      <Menu
        mode="inline"
        defaultSelectedKeys={defaultSelectedKeys}
        defaultOpenKeys={['project', 'team']}
        onClick={handleMenuClick}
      >
        {/* Projects */}
        <SubMenu key="project" icon={<ProjectTwoTone />} title="Projects">
          <Menu.ItemGroup style={{"text-align":"start"}} key="p">
            <Menu.Item icon={<ProjectOutlined style={{color:magenta[4]}}/>} key="p1" onClick={()=>navigate("project")}>Project 1</Menu.Item>
            <Menu.Item icon={<ProjectOutlined style={{color:magenta[4]}}/>} key="p2" onClick={()=>navigate("project")}>Project 2</Menu.Item>
            <Menu.Item  key="pp"  onClick={()=>{navigate("list/projects")}}>View all projects</Menu.Item>
            <Menu.Item  key="cycle"  onClick={()=>{navigate("recycle")}}><UndoOutlined />  Recycle</Menu.Item>
            
          </Menu.ItemGroup>
        </SubMenu>

        {/* Teams */}
        <SubMenu key="team" icon={<TeamOutlined style={{color:blue[5]}} />} title="Teams">
          <Menu.ItemGroup style={{"text-align":"start"}} key="t" >
            <Menu.Item icon={<GroupOutlined style={{color:cyan[4]}}/>} key="t1">Team 1</Menu.Item>
            <Menu.Item icon={<GroupOutlined style={{color:cyan[4]}}/>} key="t2">Team 2</Menu.Item>
            <Menu.Item  key="pt" onClick={()=>{navigate("list/teams")}} >View all teams</Menu.Item>

          </Menu.ItemGroup>
        </SubMenu>

        {/* Settings */}
        <SubMenu key="setting" icon={<SettingTwoTone />} title="Settings">
          <Menu.ItemGroup style={{"text-align":"start"}} key="s" >
            <Menu.Item icon={<SettingOutlined style={{color:grey[6]}}/>} key="s1" onClick={()=>{navigate("site-setting")}}>Setting</Menu.Item>
            <Menu.Item icon={<UserOutlined style={{color:blue[3]}}/>} key="s2" onClick={()=>{navigate("manage/members")}}>Manage Access</Menu.Item>
            <Menu.Item icon={<ProjectOutlined style={{color:blue[3]}}/>} key="s3" onClick={()=>{navigate("manage/projects")}}>Manage Projects</Menu.Item>
            <Menu.Item icon={<TeamOutlined style={{color:blue[3]}}/>} key="s4" onClick={()=>{navigate("manage/teams")}}>Manage Teams</Menu.Item>
            <Menu.Item icon={<MailOutlined style={{color:blue[3]}}/>} key="s5" onClick={()=>{navigate("manage/invitations")}}>Manage Invitations</Menu.Item>
          </Menu.ItemGroup>
        </SubMenu>
      </Menu>
    </>
  )
}

export default SiteSider
