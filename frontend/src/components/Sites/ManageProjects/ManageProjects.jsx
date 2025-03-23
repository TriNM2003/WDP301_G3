import { useContext, useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import CreateProject from "../../../components/Projects/CreateProject";
import { AppContext } from "../../../context/AppContext";
import ManageProjectsBreadcrump from "./ManageProjectsBreadcrump";
import ProjectsTable from "./ProjectsTable";
import ProjectsSearchbar from "./ProjectsSearchbar";
import authAxios from "../../../utils/authAxios";
import CreateProjectModal from "./CreateProjectModal";
import EditProjectSettingsModal from "./EditProjectSettingsModal";
import axios from "axios";




// component
const ManageProjects = () => {
  const nav = useNavigate();
  const [createProjectModalVisible, setCreateProjectModalVisible] = useState(false);
  const [editProjectModalVisisble, setEditProjectModalVisible] = useState(false);
  const {showNotification, showMessage, messageHolder, projectAPI, userApi, site, user} = useContext(AppContext);
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allUser, setAllUser] = useState([]);
  const [selectedProjectName, setSelectedProjectName] = useState();
  const [selectedEmail, setSelectedEmail] = useState([]);
  const [userEmails, setUserEmails] = useState([]);
  const [currentProjectSettings, setCurrentProjectSettings] = useState({
    projectId: "",
    projectName: "",
    projectAvatar: "",
  })
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchData()
  }, [projectAPI])

  const tableData = (rawProjects, userList) => {
    try {
      return rawProjects?.reduce((acc, project, index) => {
        const projectManagerId = project?.projectMember.find(member => member.roles.includes("projectManager"))._id;
        const projectManager = userList?.find(user => user._id === projectManagerId);
        if(project.projectStatus === "active"){
          acc.push({
            key: index + 1,
            projectId: project._id,
            projectName: project.projectName,
            projectAvatar: project.projectAvatar,
            projectManager: projectManager.email,
            projectManagerAvatar: projectManager.userAvatar,
            projectStatus: project.projectStatus,
            createDate: formatDate(project.createdAt),
            updateDate: formatDate(project.updatedAt)
        })
        }
        return acc;
      }, [])
    } catch (error) {
      console.log(error)
    }
  }


  const fetchData = async () => {
    try {
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
    } catch (error) {
      console.log(error)
    }
    
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
    const matchesSearch = project?.projectName.toLowerCase().includes(searchTerm?.toLowerCase());    
    return matchesSearch;
  });

  const handleFileChange = ({ file }) => {
    const fileReader = new FileReader();
    fileReader.onload = () => setImagePreview(fileReader.result);
    fileReader.readAsDataURL(file);
    setSelectedFile(file);
  };

  // handle go to project setting
  const handleEditProject = async () => {
    try {
      // console.log("Project setting:", currentProjectSettings, selectedFile);
      const formData = new FormData();
      formData.append("projectName", currentProjectSettings.projectName);
      if (selectedFile) {
        formData.append("projectAvatar", selectedFile);
      }
      const response = await axios.put(`http://localhost:9999/sites/${site._id}/projects/${currentProjectSettings.projectId}/project-setting-v2`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      // console.log(response.data)


      const result = await authAxios.get(`${projectAPI}/get-all`);
      const projectsOfSameSite = result.data.filter(project => project?.site?.toString() === site?._id?.toString()) || [];
      setProjects(tableData(projectsOfSameSite, allUser));
      setEditProjectModalVisible(false);
      setCurrentProjectSettings({ projectName: "", projectAvatar: "" });
      setSelectedFile(null);
      setImagePreview(null);
      showMessage("success", "Edit project successfully", 2);
      showNotification(`Project ${currentProjectSettings.projectName} settings has been changed`);
    } catch (error) {
      console.log(error)
    }
    
  }


  // handle remove project
  const handleMoveToTrash = async (projectId, projectName) => {
    try {
      // update database
      await authAxios.put(`${projectAPI}/${projectId}/remove-to-trash-v2`);

      // update fe state
      setProjects(projects.map(project => project.projectId.toString() === projectId ? {...project, projectStatus: "archived"} : project));
      showMessage("success", `Project ${projectName} moved to trashcan successfully`, 2);
      showNotification(`📑 Project ${projectName} has been moved to trashcan 🗑 by John Smith 👋`)
    } catch (error) {
      console.log(error)
    }
    
  };


  

  // render fe
  return (
    <div style={{ padding: "40px", textAlign: "left", backgroundColor: 'white', minHeight: "calc(100vh - 90px)", overflowY: "unset"}}>
      {/* hien thi message api */}
      {messageHolder}
      {/* Breadcrumb */}
      <ManageProjectsBreadcrump />
      {/* title and button */}
      <ProjectsSearchbar setCreateProjectModal={setCreateProjectModalVisible} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* project table */}
      <ProjectsTable parseDate={parseDate} handleMoveToTrash={handleMoveToTrash} filteredProjects={filteredProjects} setEditProjectModalVisible={setEditProjectModalVisible} setCurrentProjectSettings={setCurrentProjectSettings}/>
      {/* create project modal */}
      <CreateProjectModal createProjectModalVisible={createProjectModalVisible} 
      setCreateProjectModalVisible={setCreateProjectModalVisible} 
      handleCreateProject={handleCreateProject} 
      selectedProjectName={selectedProjectName}
      setSelectedProjectName={setSelectedProjectName}
      selectedEmail={selectedEmail} 
      setSelectedEmail={setSelectedEmail} 
      userEmails={userEmails} />
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
  );
};

export default ManageProjects;
