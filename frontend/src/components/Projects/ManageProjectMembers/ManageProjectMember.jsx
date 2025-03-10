import { useContext, useEffect, useState } from "react";
import {
  Select,
  Typography,
  Modal,
} from "antd";
import {useNavigate, useParams } from "react-router-dom";
import {AppContext} from "../../../context/AppContext"
import authAxios from "../../../utils/authAxios";
import ManageProjectMemberBreadcrump from "./ManageProjectMemberBreadcrump";
import ProjectMemberTable from "./ProjectMemberTable";
import AddProjectMemberModal from "./AddProjectMemberModal";
import SearchAddProjectMember from "./SearchAddProjectMember";
import FilterProjectMember from "./FilterProjectMember";



const ManageProjectMember = () => {
  // state
  const {projectSlug} = useParams();
  const {user, project, projects, setProject, userApi, showNotification, projectAPI, showMessage, messageHolder} = useContext(AppContext)
  const [userEmails, setUserEmails] = useState([]);
  const [projectRoles, setProjectRoles] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState();
  const [selectMemberRole, setSelectedMemberRole] = useState();
  const nav = useNavigate();
  const [currentProject, setCurrentProject] = useState({});
  
  // filter by name and role
  const filteredMembers = projectMembers.filter((member) => {
    const matchesSearch = member.projectMemberName?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesRole = selectedRole === "All" || !selectedRole || member.projectMemberRole === selectedRole;
    return matchesSearch && matchesRole;
  });

  
 // use effect
  useEffect(() => {
    console.clear();
    if(!projectSlug){
      showMessage("error", "Project name not found", 2);
    }
    fetchData();
  },[project])

  const formattedProjectMembers = (rawProjectMembers) => {
    return rawProjectMembers?.map((member, index) => {
    return { 
      key: index+1,
      projectMemberId: member._id._id, 
      projectMemberName: member._id.username, 
      projectMemberEmail: member._id.email, 
      projectMemberRole: member.roles[0],
      projectMemberAvatar: member._id.userAvatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    }}) || []

  } 

  const fetchData = async () => {
    try {
      const currProject = projects?.find(item => item.projectSlug === projectSlug) || [];
      setCurrentProject(currProject || {})
      console.log(projects)
      //get project member
      if(!project)
        return;
      const rawProjectMembers = await authAxios.get(`${projectAPI}/${project._id || currProject._id}/get-project-members`);
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

  const formatRole = (memberRole) => {
    let role;
        if(memberRole === "projectManager" || memberRole === "Manager"){
          role = "Project Manager"
        }else if(memberRole === "projectMember" || memberRole === "Member"){
          role = "Project Member"
        }else{
          role = "Undefined?"
        }
    return role;
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

 // Xử lý đổi vai trò
const handleRoleChange = async (key, updatedRoleList, projectMemberId, projectMemberName) => {
  console.log("role changed: ", updatedRoleList, projectMemberId)
  if(updatedRoleList.length === 0){
    showMessage("warning", "User must have at least 1 role", 2);
    return
  }
  await authAxios.put(`${projectAPI}/${project._id}/edit-project-member`, 
    { updatedRoleList: updatedRoleList,
      projectMemberId: projectMemberId
    }
  )

  showNotification(`Project member ${projectMemberName} role has been changed to ${updatedRoleList?.map(role => formatRole(role)) || "?"}`)
  await showMessage("success", "Change project member role successfully", 2);

  const rawProjectMembers = await authAxios.get(`${projectAPI}/${project._id || "notFound"}/get-project-members`);
  const projectMember = formattedProjectMembers(rawProjectMembers.data || []) || [];
  setProjectMembers(projectMember || []);
};


  // Xử lý xóa thành viên
  const handleRemoveMember = async (key, projectMemberName, projectMemberId, projectMemberAvatar, projectMemberEmail) => {
    try {
      // console.log(projectMemberName, projectMemberId)
      const response = await authAxios.delete(`${projectAPI}/${project._id}/remove-project-member`, 
        { data: {
          projectMemberId: projectMemberId
        } });
      const updateProjectMember = response?.data?.projectMember || projectMembers;
      console.log(updateProjectMember)

      showNotification(`Project member ${projectMemberName} has been removed from project ${project?.projectName}`)
      await showMessage("success", "Remove project member successfully", 2);
      // cap nhap du lieu moi
    const newEmailList = [...userEmails, {
      value: projectMemberEmail,
      label: projectMemberEmail,
      avatar: projectMemberAvatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTgD14vQ6I-UBiHTcwxZYnpSfLFJ2fclwS2A&s",
      userId: projectMemberId
    }];
    setUserEmails(newEmailList);
    setSelectedEmail();
    setProjectMembers(formattedProjectMembers(updateProjectMember));
    } catch (error) {
      console.log(error)
    }
  };



  return (
      <div style={{ padding: "40px", paddingTop: '15px', textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)", width: "100%"}}>
      {/* hien thi message api */}
      {messageHolder}
      {/* Breadcrumb */}
      <ManageProjectMemberBreadcrump />
      {/* search and add */}
      <SearchAddProjectMember searchTerm={searchTerm} setSearchTerm={setSearchTerm} setAddMemberModalVisible={setAddMemberModalVisible} />
      {/* filter members by role */}
      <FilterProjectMember project={project} setSelectedRole={setSelectedRole} formatRole={formatRole} />

      {/* Bảng danh sách thành viên */}
      <ProjectMemberTable project={project} formatRole={formatRole} handleRoleChange={handleRoleChange} handleRemoveMember={handleRemoveMember} filteredMembers={filteredMembers} />
      {/* Modal add thành viên */}
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
  );
};

export default ManageProjectMember;
