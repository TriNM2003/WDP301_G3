import { useContext, useEffect, useState } from "react";
import CreateProject from "../../../components/Projects/CreateProject";
import { AppContext } from "../../../context/AppContext";
import ManageProjectsBreadcrump from "./ManageProjectsBreadcrump";
import ProjectsTable from "./ProjectsTable";
import ProjectsSearchbar from "./ProjectsSearchbar";
import authAxios from "../../../utils/authAxios";
import EditProjectSettingsModal from "./EditProjectSettingsModal";

// component
const ManageProjects = () => {
  const [loading, setLoading] = useState(false);
  const [createProjectModalVisible, setCreateProjectModalVisible] = useState(false);
  const [editProjectModalVisisble, setEditProjectModalVisible] = useState(false);
  const {showNotification, showMessage, messageHolder, projects, setProjects, projectAPI, site, siteAPI} = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState([]);
  const [currentProjectSettings, setCurrentProjectSettings] = useState({
    projectId: "",
    projectName: "",
    projectAvatar: "",
    projectSlug: "",
  })
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    try {
      const data = projects?.reduce((acc, project, index) => {
        const projectManager = project.projectMember.find(member => member.roles.includes("projectManager"))._id;
        if(project.projectStatus === "active"){
          acc.push({
            key: index + 1,
            projectId: project._id,
            projectName: project.projectName,
            projectAvatar: project.projectAvatar,
            projectManager: projectManager.email,
            projectManagerAvatar: projectManager.userAvatar,
            projectStatus: project.projectStatus,
            projectSlug: project.projectSlug,
            createDate: project.createdAt,
            updateDate: project.updatedAt
        })
        }
      return acc;
      }, [])
      setTableData(data);
  } catch (error) {
    console.log(error)
  }
  }, [projectAPI, projects])


  function fetchProjectData() {
    if (site._id) {
      authAxios.get(`${siteAPI}/${site._id}/projects/get-by-site`,)
        .then((res) => {
          setProjects(res.data);
        })
        .catch((err) => {
          console.error("Error fetching projects in site:", err);
        });
    }
  }

  // filter by search
  const filteredProjects = tableData?.filter((project) => {
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

  async function handleCreateProject(){
    setCreateProjectModalVisible(false);
  }

  // handle go to project setting
  const handleEditProject = async () => {
    try {
      setLoading(true);
      // console.log("Project setting:", currentProjectSettings, selectedFile);
      const formData = new FormData();
      formData.append("projectName", currentProjectSettings.projectName);
      formData.append("projectSlug", currentProjectSettings.projectSlug);
      if (selectedFile) {
        formData.append("projectAvatar", selectedFile);
      }
      await authAxios.put(`http://localhost:9999/sites/${site._id}/projects/${currentProjectSettings.projectId}/project-setting-v2`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchProjectData();
      setCurrentProjectSettings({ projectName: "", projectAvatar: "", projectId:"", projectSlug: "" });
      setSelectedFile(null);
      setImagePreview(null);
      setEditProjectModalVisible(false);
      showMessage("success", "Edit project successfully", 2);
      showNotification(`Project ${currentProjectSettings.projectName} settings has been changed`);
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false);
    }
    
  }


  // handle remove project
  const handleMoveToTrash = async (projectId, projectName) => {
    try {
      await authAxios.put(`${projectAPI}/${projectId}/remove-to-trash-v2`);

      fetchProjectData();
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
      <ProjectsTable  handleMoveToTrash={handleMoveToTrash} filteredProjects={filteredProjects} setEditProjectModalVisible={setEditProjectModalVisible} setCurrentProjectSettings={setCurrentProjectSettings}/>
      {/* create project modal */}
      <CreateProject visible={createProjectModalVisible} onCancel={()=> {setCreateProjectModalVisible(false)}} onCreate={handleCreateProject} />
      <EditProjectSettingsModal
        loading={loading}
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
