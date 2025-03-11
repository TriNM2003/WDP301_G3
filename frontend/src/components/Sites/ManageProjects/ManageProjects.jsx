import { useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import CreateProject from "../../../components/Projects/CreateProject";
import { AppContext } from "../../../context/AppContext";
import ManageProjectsBreadcrump from "./ManageProjectsBreadcrump";
import ProjectsTable from "./ProjectsTable";
import ProjectsSearchbar from "./ProjectsSearchbar";
import authAxios from "../../../utils/authAxios";
import CreateProjectModal from "./CreateProjectModal";




// component
const ManageProjects = () => {
  const nav = useNavigate();
  const [createProjectModalVisible, setCreateProjectModalVisible] = useState(false);
  const {showNotification, showMessage, messageHolder, projectAPI, userApi, site, user} = useContext(AppContext);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUser, setAllUser] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState();
  const [selectedEmail, setSelectedEmail] = useState([]);
  const [userEmails, setUserEmails] = useState([]);

  useEffect(() => {
    fetchData()
  }, [projectAPI])

  const tableData = (rawProjects, userList) => {
    try {
      return rawProjects?.map((project, index) => {
        const projectManagerId = project.projectMember.find(member => member.roles.includes("projectManager"))._id;
        const projectManager = userList.find(user => user._id === projectManagerId);
        return  { key: index+1, 
          projectName: project.projectName, 
          projectAvatar: project.projectAvatar, 
          projectManager: projectManager.email, 
          projectManagerAvatar: projectManager.userAvatar,
          projectStatus: project.projectStatus,
          createDate: formatDate(project.createdAt), 
          updateDate: formatDate(project.updatedAt)
        } || {}
      }) || []
    } catch (error) {
      console.log(error)
    }
  }


  const fetchData = async (userList) => {
    //get all user to find project manager info
    const users = await authAxios.get(`${userApi}/all`);
    setAllUser(users.data);
    const filteredEmails = users?.data?.reduce((acc, currUser) => {
      const isSameSite = currUser.site === user.site;
      const isActive = currUser.status === "active";
      // loai bo user khong la thanh vien cua site , khongla thanh vien cua project
      if(isSameSite && isActive){
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
    // console.log(filteredEmails)

    // get all projects
    const result = await authAxios.get(`${projectAPI}/get-all`);
    const projectsOfSameSite = result.data.filter(project => project?.site?.toString() === site?._id?.toString()) || [];
    // console.log(tableData(projectsOfSameSite, users.data))
    setProjects(tableData(projectsOfSameSite, users.data));
  }

  const formatDate = (mongoDate) => {
    if (!mongoDate) return "";
  
    const date = new Date(mongoDate);
    return date.toLocaleDateString("vi-VN"); // "dd/mm/yyyy"
  };

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    // console.log(new Date(year, month - 1, day))
    return new Date(year, month - 1, day);
  };


  const handleCreateProject = async () => {
    try {
      console.log(selectedProjectName, selectedEmail);
    const projectManagerId = userEmails.find(email => email.value === selectedEmail).userId || "notfound";
    if(projectManagerId === "notfound"){
      showMessage("error", `Project manager not found!`, 2);
      return;
    }
    //create project
    await authAxios.post(`${projectAPI}/create-v2`, {projectManagerId:projectManagerId, projectName: selectedProjectName});
    // get new projects
    const result = await authAxios.get(`${projectAPI}/get-all`);
    const projectsOfSameSite = result.data.filter(project => project?.site?.toString() === site?._id?.toString()) || [];
    // console.log(tableData(projectsOfSameSite, users.data))
    setProjects(tableData(projectsOfSameSite, allUser));

    //show success message
    showMessage("success", `Create project successfully`, 2);
   showNotification(`📑 Project ${selectedProjectName} has been created by John Smith 👋`)
    setCreateProjectModalVisible(false);
    setSelectedEmail([]);
    setSelectedProjectName();
    } catch (error) {
      console.log(error)
    }

  }

  // filter by search
  const filteredProjects = projects?.filter((project) => {
    // filter by search
    const matchesSearch = project?.projectName?.toLowerCase().includes(searchTerm?.toLowerCase()) || [];    
    return matchesSearch;
  }) || [];

  // handle go to project setting
  const handleEditProject = (projectName) => {
    showMessage("success", "Edit project successfully", 2);
  }


  // handle remove project
  const handleRemoveProject = (key, name) => {
    // update database
    
    // update fe state
    setProjects(projects.filter((member) => member.key !== key));
    showMessage("success", `Project ${name} moved to trashcan successfully`, 2);
   showNotification(`📑 Project ${name} has been moved to trashcan 🗑 by John Smith 👋`)
  };


  

  // render fe
  return (
    <div style={{ padding: "40px", textAlign: "left", backgroundColor: 'white', height: "calc(100vh - 90px)"}}>
      {/* hien thi message api */}
      {messageHolder}
      {/* Breadcrumb */}
      <ManageProjectsBreadcrump />
      {/* title and button */}
      <ProjectsSearchbar setCreateProjectModal={setCreateProjectModalVisible} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* project table */}
      <ProjectsTable parseDate={parseDate} handleRemoveProject={handleRemoveProject} nav={nav} filteredProjects={filteredProjects} handleEditProject={handleEditProject}/>
      {/* create project modal */}
      <CreateProjectModal createProjectModalVisible={createProjectModalVisible} 
      setCreateProjectModalVisible={setCreateProjectModalVisible} 
      handleCreateProject={handleCreateProject} 
      selectedProjectName={selectedProjectName}
      setSelectedProjectName={setSelectedProjectName}
      selectedEmail={selectedEmail} 
      setSelectedEmail={setSelectedEmail} 
      userEmails={userEmails} />
    </div>
  );
};

export default ManageProjects;
