import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import authAxios from '../utils/authAxios';
import { message, notification } from 'antd';

export const AppContext = createContext();

const excludedRoutes = ["/", "/home", "/welcome", "/auth/login", "/auth/register", "/active-account", "/forgot-password", "/reset-password"];

const AppProvider = ({ children }) => {
  //parameter

  const accessToken = localStorage.getItem("accessToken");

  const [createSubActivity, setCreateSubActivity] = useState(false);

  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(null);
  const [site, setSite] = useState({})
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({});
  const location = useLocation();
  const nav = useNavigate();
  const [activityTypes, setActivityTypes] = useState([]);

  // Activity
  const [deleteActivity, setDeleteActivity] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState("");
  const [confirmActivity, setConfirmActivity] = useState("");
  const [activityModal, setActivityModal] = useState(false);
  const [createActivityModal, setCreateActivityModal] = useState(false);
  const [activityName, setActivityName] = useState("");

  const [userActivities, setUserActivities] = useState([]);
  // Team

  const [teams, setTeams] = useState({});


  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState({});

  //Sprint
  const [completedSprint, setCompletedSprint] = useState(false);
  const [sprints, setSprints] = useState([])


  // api
  const authAPI = "http://localhost:9999/auth";
  const userApi = "http://localhost:9999/users";
  const siteAPI = "http://localhost:9999/sites";
  const activityTypeAPI = "http://localhost:9999/activityTypes";

  // State lưu thông tin user & accessToken




  //parameter
  const [user, setUser] = useState({});





  //call api
  useEffect(() => {
    if (location.pathname !== '/login') {
      localStorage.setItem("lastVisitedUrl", location.pathname);
    }
    if (!excludedRoutes.includes(location.pathname)) {
      checkLoginStatus();
    }


    axios.get(`${userApi}/user-profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(res => {
        setUser(res.data);
      })
      .catch(error => {
        console.log(error.response?.data?.message);
      });
  }, [location.pathname]);



  // get project in site

  useEffect(() => {

    axios.get(`${siteAPI}/get-by-user-id`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        setSite(res.data);
      })
      .catch((err) => {
        console.error("Error fetching site:", err);
      });

  }, [accessToken]);
  useEffect(() => {

    axios.get(`${activityTypeAPI}/get-all`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        setActivityTypes(res.data.types);
      })
      .catch((err) => {
        console.error("Error fetching site:", err);
      });

  }, [accessToken]);

  useEffect(() => {
    if (site._id) {
      axios.get(`${siteAPI}/${site._id}/projects/get-by-site`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then((res) => {
          setProjects(res.data);
        })
        .catch((err) => {
          console.error("Error fetching projects in site:", err);
        });
    }
  }, [site]);

// get activities by userId
    useEffect(() => {
      if (user._id) {
        axios.get(`${userApi}/user-activities`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
          .then((res) => {
            setUserActivities(res.data.activities);
          })
          .catch((err) => {
            console.error("Error fetching projects in site:", err);
          });
      }
    }, [user]);


// get teams in site
  useEffect(() => {
    if (site._id) {
      axios.get(`${siteAPI}/${site._id}/teams/get-teams-in-site`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then((res) => {
          setTeams(res.data);
        })
        .catch((err) => {
          console.error("Error fetching projects in site:", err);
        });
    }
  }, [site]);





  //fuction

  const showNotification = (message, description) => {
    notification.info({
      message: message,
      description: description,
      placement: "bottomRight",
    });
  };
  //create activity
  const handleActivityCreate =  (sprint, stage, type, parent) => {
    if (activityName.trim().length < 3) {
      message.warning("Activity title must be at least 3 characters!");
      return;
    }
    const stageId = "67c56083dbc95aae6823267d";
    const typeId = activityTypes?.find(t => t.typeName.trim().toUpperCase() == type.trim().toUpperCase())?._id
    const sprintId = sprints?.find((s) => s.sprintName?.trim().toUpperCase() == sprint?.trim().toUpperCase())?._id
    axios.post(`${siteAPI}/${site?._id}/projects/${project?._id}/activities/create`,
      {
        activityTitle: activityName,
        sprint: sprintId ? sprintId : null,
        stage: stageId,
        type: typeId,
        parent: parent ,
        createBy: user?._id,
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }

    )
      .then((res) => {

        message.success(`Activity "${res.data?.activity.activityTitle}" created successfully!`);
        showNotification(`Project update`, `User1 just created activity "${res.data.activity?.activityTitle}".`);
        setActivityName("");

        setCreateActivityModal(false);
      })
      .catch((err) => {
        message.error(`Activity created failed!`);
        setActivityName("");

        setCreateActivityModal(false);
      })
    

  };
  // delete Activity
  const showDeleteActivity = (activityName) => {
    setActivityToDelete(activityName);
    setDeleteActivity(true);
  };

  const handleCloseDeleteActivityModal = () => {
    setDeleteActivity(false);
    setConfirmActivity(""); // Xóa input khi đóng modal
  };

  const checkLoginStatus = () => {
    authAxios.get(`${authAPI}/checkLoginStatus`)
      .then(() => {
        const lastVisitedUrl = localStorage.getItem("lastVisitedUrl");
        nav(lastVisitedUrl);
      })
      .catch(err => {
        // khong co refresh token hoac loi lay refresh token
        console.log(err.response.data.message);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessTokenExp");
        localStorage.removeItem("userId");
        setUser({});
        nav('/auth/login');
      })
  }


  const handleDelete = () => {
    if (confirmActivity === activityToDelete) {
      message.success(`Activity "${activityToDelete}" has been deleted successfully!`);
      showNotification(`Project update`, `User1 just deleted activity ${activityToDelete}.`);
      handleCloseDeleteActivityModal();
      closeActivity();
    } else {
      message.error("Activity name does not match. Please try again!");
    }
  };
  // hien thi Activity
  const showActivity = (activity) => {
    setActivityModal(true);
    setActivity(activity)


  };

  const closeActivity = () => {
    setActivityModal(false);
    setActivity()
  };

  //Complete sprint
  const showCompletedSprint = () => {
    setCompletedSprint(true);
  };

  const handleCompletedCancel = () => {
    setCompletedSprint(false);
  };

  const handleCompletedSprint = () => {
    message.success({
      content: `🎯 (Sprint name) has been completed successfully! 🚀 
                  - ✅ 10 (activitys) completed 
                  - ⚠️ 3 (uncompleted bugs) moved to {sprint}`,
      duration: 4, // Thời gian hiển thị message (4 giây)

    });
    showNotification(`Project update`, `🎯 (Sprint name) has been completed successfully! 🚀 
    - ✅ 10 (activitys) completed 
    - ⚠️ 3 (uncompleted bugs) moved to  {sprint}`)

    setCompletedSprint(false);

  };

  const handleAddTeamMember = () => {
    showNotification(`Team update`, `Team Leader just added a new team member to the project.`);
  }

  const handleKickTeamMember = () => {
    showNotification(`Team update`, `Team Leader just kicked a team member out of the project.`);
  }

  return (
    <AppContext.Provider value={{
      accessToken,
      authAPI, siteAPI, userApi,
      accessToken,
      user, setUser,
      //setAccessToken,
      defaultSelectedKeys, setDefaultSelectedKeys,
      showNotification,
      showDeleteActivity, handleDelete, handleCloseDeleteActivityModal, deleteActivity, setDeleteActivity, activityToDelete, setActivityToDelete, confirmActivity, setConfirmActivity,
      activityModal, setActivityModal, showActivity, closeActivity,
      handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName,
      completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel,
      handleAddTeamMember, handleKickTeamMember,
      project, setProject, projects, setProjects, setSite, site, activities, setActivities, sprints, setSprints, activity, setActivity,
      createSubActivity, setCreateSubActivity,
      userActivities, setUserActivities, teams, setTeams

    }}>
      {children}
    </AppContext.Provider>
  );
};


export default AppProvider;
