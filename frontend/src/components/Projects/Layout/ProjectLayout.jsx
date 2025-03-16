import TabPane from 'antd/es/tabs/TabPane'
import React, { useContext, useEffect, useState } from 'react'
import Title from 'antd/es/typography/Title'


import { red } from '@ant-design/colors'
import { BarChartOutlined, BarsOutlined, DeleteOutlined, GroupOutlined, MoreOutlined, SettingOutlined, SyncOutlined, TableOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Flex, Menu, Popconfirm, Row, Space, Tabs } from 'antd'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import DeleteActivityModal from '../Detail/DeleteActivityModal'
import { AppContext } from '../../../context/AppContext'
import AddProjectMemberModal from '../ManageProjectMembers/AddProjectMemberModal'
import authAxios from '../../../utils/authAxios'
import EditProjectSettingsModal from '../../Sites/ManageProjects/EditProjectSettingsModal'
import axios from 'axios'
function ProjectLayout() {
    const {user, project, setProject, setProjects, messageHolder, projectAPI, showMessage, showNotification, site, accessToken} = useContext(AppContext);

    const nav = useNavigate();
    const location = useLocation();
    const {projectSlug} = useParams();

    // project setting
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editProjectModalVisisble, setEditProjectModalVisible] = useState(false);
    const [currentProjectSettings, setCurrentProjectSettings] = useState({
        projectId: project?._id,
        projectName: project?.projectName,
        projectAvatar: project?.projectAvatar,
      })

      let isProjectManager = false;
      if (project) {
        try {
            isProjectManager = project?.projectMember?.find(member => member._id._id === user._id)?.roles.includes("projectManager");
        } catch (error) {
            console.log("error checking member project role of current project!", error)
        }
        
    }

    useEffect(() => {
        setCurrentProjectSettings({
            projectId: project?._id,
            projectName: project?.projectName,
            projectAvatar: project?.projectAvatar,
          })
        }
    , [project])

   
    const getActiveKey = () => {
        if (location.pathname.includes("summary")) return "summary";
        if (location.pathname.includes("sprint")) return "sprint";
        if (location.pathname.includes("board")) return "board";
        return "board"; 
    };

    const handleFileChange = ({ file }) => {
        const fileReader = new FileReader();
        fileReader.onload = () => setImagePreview(fileReader.result);
        fileReader.readAsDataURL(file);
        setSelectedFile(file);
      };

      const handleEditProject = async () => {
        try {
        //   console.log("Project setting:", currentProjectSettings.projectName, selectedFile); return;
          const formData = new FormData();
          formData.append("projectName", currentProjectSettings.projectName);
          if (selectedFile) {
            formData.append("projectAvatar", selectedFile);
          }
          const updateProject = await authAxios.put(`http://localhost:9999/sites/${site._id}/projects/${currentProjectSettings.projectId}/project-setting`, formData, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });

          console.log(updateProject.data)
          setProject(updateProject.data);
          const updatedProjectList = await authAxios.get(`${projectAPI}/get-all`);
          setProjects(updatedProjectList.data);
          setEditProjectModalVisible(false);
          setSelectedFile(null);
          setImagePreview(null);
          showMessage("success", "Edit project successfully", 2);
          showNotification(`Project ${currentProjectSettings.projectName} settings has been changed`);
          nav(`/site/list/projects/${updateProject.data.projectSlug}`);
          window.location.reload();
        } catch (error) {
          console.log(error)
        }
        
      }

      // handle remove project
      const handleMoveToTrash = async (projectId, projectName) => {
        try {
          // update database
          await authAxios.put(`${projectAPI}/${projectId}/remove-to-trash`);
    
          // update fe state
          await showMessage("success", `Project ${projectName} moved to trashcan successfully`, 2);
          await showNotification(`📑 Project ${projectName} has been moved to trashcan 🗑 by John Smith 👋`)

          nav("/site/recycle");
          window.location.reload();
        } catch (error) {
            console.error("Error moving project to trash:", error);
            showMessage("error", `Failed to move project ${projectName} to trashcan. Please try again.`);
        }
        
      };

    return (
        <div style={{ height: "100%" }}>
            {messageHolder}
            <Row justify='space-around' style={{ height: "10%" }}>
                <Col span={6} align='start'>
                    <Title level={4}> {project?.projectName} </Title>
                </Col>
                <Col span={8}>

                </Col>

                <Col span={6} align='end'>
                    <Space style={{ height: "100%" }} align='center'>
                    {isProjectManager ?<>
                        <Button color='primary' variant='solid' style={{ 'border-radius': "5%" }} ><UserAddOutlined />Add</Button>
                        <Dropdown style={{ height: "100%" }}
                            overlay={
                                <Menu>
                                    <Menu.Item key="1" icon={<SettingOutlined />} onClick={() => setEditProjectModalVisible(true)}> Project settings</Menu.Item>
                                    <Menu.Item key="2" icon={<GroupOutlined />} onClick={() => nav(`/site/list/projects/${projectSlug}/manage/members`)}> Manage members</Menu.Item>
                                    <Menu.Item key="3" icon={<DeleteOutlined style={{ color: red[6] }} />}>
                                        <Popconfirm
                                            title="Are you sure you want to move this project to trash?"
                                            onConfirm={() => handleMoveToTrash(project?._id, project?.projectName)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            Remove to trash
                                        </Popconfirm>
                                    </Menu.Item>

                                </Menu>
                            }
                        >
                            <Title style={{ margin: "0", height: "100%" }} level={5} onClick={(e) => e.preventDefault()}>
                                <Space style={{ height: "100%" }}>
                                    <Button icon={<MoreOutlined />} />
                                </Space>
                            </Title>
                        </Dropdown> 
                        </>
                        : ""  }
                    </Space>
                </Col>

            </Row>
            <Row style={{ height: "90%" }} >
                <Col span={24} style={{ height: "90%" }}>
                    <Tabs activeKey={getActiveKey()} onChange={(key) => { nav(key); }}>
                        <TabPane />
                        <TabPane tab="Summary" key="summary" icon={<BarChartOutlined />} />
                        <TabPane tab="Sprint" key="sprint" icon={<SyncOutlined />} />
                        <TabPane tab="Board" key="board" icon={<TableOutlined />} />

                    </Tabs>
                    <Outlet />
                </Col>
            </Row>
            <DeleteActivityModal/>

            <EditProjectSettingsModal
        editProjectModalVisisble={editProjectModalVisisble}
        setEditProjectModalVisible={setEditProjectModalVisible}
        handleEditProject={handleEditProject}
        currentProjectSettings={currentProjectSettings}
        setCurrentProjectSettings={setCurrentProjectSettings}
        handleFileChange={handleFileChange}
        imagePreview={imagePreview}
      />
        </div>
    )
}

export default ProjectLayout
