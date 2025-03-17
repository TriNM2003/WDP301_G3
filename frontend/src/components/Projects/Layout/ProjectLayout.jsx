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
    const {user, project, setProject, setProjects, messageHolder, projectAPI, showMessage, showNotification, site, accessToken, userApi} = useContext(AppContext);

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

      // add member
    const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState();
    const [userEmails, setUserEmails] = useState([]);
    const [selectMemberRole, setSelectedMemberRole] = useState();
    const [projectRoles, setProjectRoles] = useState();
    const [projectMembers, setProjectMembers] = useState([]);

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
        fetchMemberData();
        }
    , [project])

    function formatRole(text) {
        // Chèn khoảng trắng trước các chữ in hoa (trừ chữ đầu tiên)
        let result = text.replace(/([a-z])([A-Z])/g, '$1 $2');
        // Viết hoa chữ cái đầu của mỗi từ
        return result.replace(/\b\w/g, char => char.toUpperCase());
      }

    const formattedProjectMembers = (rawProjectMembers) => {
        return rawProjectMembers?.map((member, index) => {
        return { 
          key: index+1,
          projectMemberId: member.projectMember._id, 
          projectMemberName: member.projectMember.username, 
          projectMemberEmail: member.projectMember.email, 
          projectMemberRole: member.roles[0],
          projectMemberAvatar: member.projectMember.userAvatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
        }}) || []
    
      } 

    async function fetchMemberData() {
        try {
              //get project member
              if(!project)
                return;
              const rawProjectMembers = await authAxios.get(`${projectAPI}/${project._id}/get-project-members`);
              const projectMember = formattedProjectMembers(rawProjectMembers.data || []) || [];
              setProjectMembers(projectMember || []);
        
              // get user emails
              const rawEmails = await authAxios.get(`${userApi}/all`);
              const filteredEmails = rawEmails?.data?.reduce((acc, currUser) => {
              const isSameSite = currUser.site === user.site;
              const isProjectMember = projectMember.find(member => member.projectMemberId === currUser?._id.toString()) !== undefined;
              const isActive = currUser.status === "active";
              // loai bo user khong la thanh vien cua site , khongla thanh vien cua project
              if(isSameSite && !isProjectMember && isActive){
                acc.push ({
                  value: currUser.email,
                  label: currUser.email,
                  avatar: currUser.userAvatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
                  userId: currUser._id
                })
              }
              return acc;
            }, []) || []
            setUserEmails(filteredEmails || []);
            // set project roles for add member
            const roleList = project.projectRoles.map(role => {
              return {
                value: role,
                label: formatRole(role),
              }
            })
            setProjectRoles(roleList || []);
            } catch (error) {
              console.log(error)
              // nav("/home")
            }
    }

    const handleAddMember = async () => {
        console.clear();
        if(selectedEmail === "" || selectedEmail === undefined){
          showMessage("error", "Please select site member email", 2);
          return;
        }
        const currentUser = userEmails.find(user => user.value === selectedEmail)
       const newProjectMemberListRaw = await authAxios.post(`${projectAPI}/${project._id}/add-project-member`, 
        { projectMemberId: currentUser.userId,
          projectMemberRole: selectMemberRole
        })
        console.log(newProjectMemberListRaw.data);
        setAddMemberModalVisible(false);
        showNotification(`Project member ${currentUser.value} has been add to project ${project?.projectName}`)
        await showMessage("success", "Add project member successfully", 2);
        // cap nhap du lieu moi
        const newEmailList = userEmails.filter(email => email.value !== selectedEmail);
        setUserEmails(newEmailList);
        setSelectedEmail();
        const newProjectMemberList = formattedProjectMembers(newProjectMemberListRaw.data);
        setProjectMembers(newProjectMemberList);
        setSelectedMemberRole();
      }

   
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

          nav("/site");
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
                        {isProjectManager && <Button color='primary' variant='solid' style={{ 'border-radius': "5%" }} onClick={() => setAddMemberModalVisible(true)} ><UserAddOutlined />Add</Button>}
                        <Dropdown style={{ height: "100%" }}
                            overlay={
                                <Menu>
                                    <Menu.Item key="1" icon={<SettingOutlined />} onClick={() => nav(`/site/list/projects/${projectSlug}/project-setting`)}> Project settings</Menu.Item>
                                    {isProjectManager &&<>
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
                                    </> }
                                </Menu>
                            }
                        >
                            <Title style={{ margin: "0", height: "100%" }} level={5} onClick={(e) => e.preventDefault()}>
                                <Space style={{ height: "100%" }}>
                                    <Button icon={<MoreOutlined />} />
                                </Space>
                            </Title>
                        </Dropdown> 

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
        <AddProjectMemberModal addMemberModalVisible={addMemberModalVisible} 
        setAddMemberModalVisible={setAddMemberModalVisible} 
        handleAddMember={handleAddMember} 
        selectedEmail={selectedEmail} 
        setSelectedEmail={setSelectedEmail} 
        userEmails={userEmails}
        selectMemberRole={selectMemberRole}
        setSelectedMemberRole={setSelectedMemberRole}
        projectRoles={projectRoles}
        />
    
        </div>
    )
}

export default ProjectLayout
