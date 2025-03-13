import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import authAxios from '../utils/authAxios';
import { message, notification } from 'antd';

export const AppContext = createContext();

const excludedRoutes = ["/", "/home", "/welcome", "/auth/login", "/auth/register", "/active-account", "/forgot-password", "/reset-password", "/processing-invitation"];

const AppProvider = ({ children }) => {
  //parameter

  const accessToken = localStorage.getItem("accessToken");

  const [createSubActivity, setCreateSubActivity] = useState(false);

  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(null);
  const [site, setSite] = useState({})

  const location = useLocation();
  const nav = useNavigate();

  const [messageApi, messageHolder] = message.useMessage();



  //Project
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({});
  //Stage
  const [stages, setStages] = useState([]);


  // Activity
  const [activityTypes, setActivityTypes] = useState([]);
  const [deleteActivity, setDeleteActivity] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState("");
  const [confirmActivity, setConfirmActivity] = useState("");
  const [activityModal, setActivityModal] = useState(false);
  const [createActivityModal, setCreateActivityModal] = useState(false);
  const [activityName, setActivityName] = useState("");
  const [isActivityTitle, setIsActivityTitle] = useState(false)
  const [activityLoading, setActivityLoading] = useState(false)

  const [userActivities, setUserActivities] = useState([]);
  // Team

  const [teams, setTeams] = useState({});


  const [activities, setActivities] = useState([]);
  const [activity, setActivity] = useState({});

  //Sprint
  const [completedSprint, setCompletedSprint] = useState(false);
  const [sprints, setSprints] = useState([])



  //parameter
  const [user, setUser] = useState({});


  // api
  const authAPI = "http://localhost:9999/auth";
  const userApi = "http://localhost:9999/users";
  const siteAPI = "http://localhost:9999/sites";
  const projectAPI = `http://localhost:9999/sites/${user.site || "notFound"}/projects`;
  const activityTypeAPI = "http://localhost:9999/activityTypes";


  // State lưu thông tin user & accessToken




  // check token
  useEffect(() => {
    if (location.pathname !== '/login') {
      localStorage.setItem("lastVisitedUrl", location.pathname);
    }
    if (!excludedRoutes.includes(location.pathname)) {
      checkLoginStatus();
    }
  }, [location.pathname])



  //call api
  useEffect(() => {

    if (accessToken) {
      axios.get(`${userApi}/user-profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
        .then(res => {
          setUser(res.data);
        })
        .catch(error => {
          console.log(error.response?.data?.message);
        });
    }

  }, [accessToken]);



  // get project in site

  useEffect(() => {

    if (accessToken) {
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
    }

  }, [accessToken]);

  useEffect(() => {

    if (accessToken) {
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
    }

  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
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
    }
  }, [site]);

  // get activities by userId
  useEffect(() => {
    if (accessToken) {
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
  const showMessage = (type, content, duration) => {
    messageApi.open({
      type: type,
      content: content,
      duration: duration
    });
  }

  const showNotification = (message, description) => {
    notification.info({
      message: message,
      description: description,
      placement: "bottomRight",
    });
  };
  //create activity
  const handleActivityCreate = (sprint, stage, type, parent) => {
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
        parent: parent,
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
  const activityModalLoading = () => {
    setActivityLoading(true);
    setTimeout(() => {
      setActivityLoading(false);
    }, 1000);
  }
  // moveActivity
  const handleMoveActivity = async (field, selectedActivity, data) => {
    axios.put(`${siteAPI}/${site?._id}/projects/${project?._id}/activities/${selectedActivity?._id}/move`,
      {
        [field]: data
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }

    )
      .then((res) => {
        activityModalLoading();
        setActivity(res?.data?.activity);
        const updateActivities = activities.map((a) =>
          a._id === res?.data?.activity?._id ? res?.data?.activity : a
        );
        setActivities(updateActivities)
        message.success(`Activity "${selectedActivity?.activityTitle}" moved successfully!`);
        showNotification(`Project update`, `User1 just edit activity "${selectedActivity?.activityTitle}".`);
      })
      .catch((err) => {
        message.error(err.response?.data?.error?.message || "Move activity failed");
        console.log(err);
      })
  }
  // delete Activity
  const showDeleteActivity = (activity) => {
    setActivityToDelete(activity);
    setDeleteActivity(true);
  };

  const handleCloseDeleteActivityModal = () => {
    setDeleteActivity(false);
    setConfirmActivity("");
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


  const handleDeleteActivity = async () => {
    if (confirmActivity === activityToDelete?.activityTitle) {
      try {
        axios.delete(`${siteAPI}/${site?._id}/projects/${project?._id}/activities/${activityToDelete?._id}/delete`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          })
        const updateActivities = activities?.filter((a) =>
          a._id != activityToDelete?._id
        );
        setActivities(updateActivities)

        message.success(`Activity "${activityToDelete}" has been deleted successfully!`);
        showNotification(`Project update`, `User1 just deleted activity ${activityToDelete}.`);
        handleCloseDeleteActivityModal();
        closeActivity();
      } catch (error) {

      }
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


  return (
    <AppContext.Provider value={{
      accessToken,
      authAPI, siteAPI, userApi, projectAPI,
      user, setUser,
      //setAccessToken,
      defaultSelectedKeys, setDefaultSelectedKeys,
      showNotification,

      showMessage, messageHolder,
      showDeleteActivity, handleDeleteActivity, handleCloseDeleteActivityModal, deleteActivity, setDeleteActivity, activityToDelete, setActivityToDelete, confirmActivity, setConfirmActivity,
      activityModal, setActivityModal, showActivity, closeActivity,
      handleActivityCreate, createActivityModal, setCreateActivityModal, activityName, setActivityName,
      completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint, handleCompletedCancel,
      stages, setStages, project, setProject, projects, setProjects, setSite, site, activities, setActivities, sprints, setSprints, activity, setActivity, activityLoading, setActivityLoading,
      createSubActivity, setCreateSubActivity, isActivityTitle, setIsActivityTitle,
      userActivities, setUserActivities, teams, setTeams, activityModalLoading,
      handleMoveActivity


    }}>
      {children}
    </AppContext.Provider>
  );
};


export default AppProvider;
