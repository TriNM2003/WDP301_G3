import { useContext, useEffect, useState } from "react";
import {
  Select,
  Typography,
  Modal,
  message,
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
  const {user, project, userApi, showNotification, projectAPI, showMessage, messageHolder, setRefreshNoti} = useContext(AppContext)
  const [userEmails, setUserEmails] = useState([]);
  const [projectRoles, setProjectRoles] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [addMemberModalVisible, setAddMemberModalVisible] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState();
  const [selectMemberRole, setSelectedMemberRole] = useState();
  const [loading, setLoading] = useState(false);
  
  // filter by name and role
  const filteredMembers = projectMembers.filter((member) => {
    const matchesSearch = member.projectMemberName?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesRole = selectedRole === "All" || !selectedRole || member.projectMemberRole === selectedRole;
    return matchesSearch && matchesRole;
  });

  
 // use effect
  useEffect(() => {
    console.clear();
    console.log(projectSlug)
    if(!projectSlug){
      showMessage("error", "Project name not found", 2);
    }
    if (projectSlug && project && project._id) {
      fetchData();
    }
  },[project])

  const formattedProjectMembers = (rawProjectMembers) => {
    return rawProjectMembers?.map((member, index) => {
    return { 
      key: index+1,
      projectMemberId: member.projectMember._id, 
      projectMemberName: member.projectMember.username, 
      projectMemberEmail: member.projectMember.email, 
      projectMemberRole: member.roles,
      projectMemberAvatar: member.projectMember.userAvatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
    }}) || []

  } 

  const fetchData = async () => {
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

  function formatRole(text) {
    // Chèn khoảng trắng trước các chữ in hoa (trừ chữ đầu tiên)
    let result = text.replace(/([a-z])([A-Z])/g, '$1 $2');
    // Viết hoa chữ cái đầu của mỗi từ
    return result.replace(/\b\w/g, char => char.toUpperCase());
  }

  const handleAddMember = async () => {
    try {
      setLoading(true)
      console.clear();
      if (selectedEmail === "" || selectedEmail === undefined) {
        showMessage("error", "Please select project member email", 2);
        return;
      }
      if(selectMemberRole === "" || selectMemberRole === undefined){
        showMessage("error", "Please select project member role", 2);
        return;
      }
      const currentUser = userEmails.find(user => user.value === selectedEmail)
      const newProjectMemberListRaw = await authAxios.post(`${projectAPI}/${project._id}/add-project-member`,
        {
          projectMemberId: currentUser.userId,
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
      setRefreshNoti(prev => !prev);
    } catch (error) {
      showMessage("error", error?.response?.data?.message, 2);
      console.log(error)
    } finally{
      setLoading(false)
    }
    
  }

 // Xử lý đổi vai trò
const handleRoleChange = async (oldRoles, updatedRoleList, projectMemberId, projectMemberName) => {
  try {
    console.log("role changed: ", updatedRoleList, projectMemberId, projectMemberName)
    if (oldRoles.includes("projectManager")) {
      message.warning("Cannot change project manager role", 2);
      return;
    }
    if (updatedRoleList.includes("projectManager")) {
      message.warning("Cannot change role to project manager");
      return;
    }
    if (updatedRoleList.length === 0) {
      message.warning("Member must have at least 1 role", 2);
      return;
    }
    await authAxios.put(`${projectAPI}/${project._id}/edit-project-member`, 
      { updatedRoleList: updatedRoleList,
        projectMemberId: projectMemberId
      }
    )
  
    showNotification(`Project member ${projectMemberName} role has been changed to ${updatedRoleList?.map(role => formatRole(role)) || "?"}`)
    showMessage("success", "Change project member role successfully", 2);

    await fetchData();
    setRefreshNoti(prev => !prev);
    // const rawProjectMembers = await authAxios.get(`${projectAPI}/${project._id || "notFound"}/get-project-members`);
    // const projectMember = formattedProjectMembers(rawProjectMembers.data || []) || [];
    // setProjectMembers(projectMember || []);
  } catch (error) {
    console.log(error)
  }
};


  // Xử lý xóa thành viên
  const handleRemoveMember = async (key, projectMemberName, projectMemberId, projectMemberAvatar, projectMemberEmail) => {
    try {
      // console.log(projectMemberName, projectMemberId)
      const response = await authAxios.delete(`${projectAPI}/${project._id}/remove-project-member`, 
        { data: {
          projectMemberId: projectMemberId
        } });
      const updateProjectMember = response?.data || projectMembers;
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
    setRefreshNoti(prev => !prev);
    } catch (error) {
      console.log(error)
    }
  };



  return (
      <div style={{ padding: "40px", paddingTop: '15px', textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)", width: "100%"}}>
      {/* hien thi message api */}
      {messageHolder}
      {/* Breadcrumb */}
      <ManageProjectMemberBreadcrump project={project}/>
      {/* search and add */}
      <SearchAddProjectMember searchTerm={searchTerm} setSearchTerm={setSearchTerm} setAddMemberModalVisible={setAddMemberModalVisible}/>
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
      loading={loading}
      />
    </div>
  );
};

export default ManageProjectMember;
