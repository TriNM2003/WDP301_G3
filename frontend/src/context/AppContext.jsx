import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import authAxios from '../utils/authAxios';
import { message, notification } from 'antd';

export const AppContext = createContext();

const excludedRoutes = ["/", "/home","/welcome", "/auth/login", "/auth/register", "/active-account", "/forgot-password", "/reset-password"];

const AppProvider = ({ children }) => {
  //parameter
  // const [accessToken,setAccessToken] = useState()
  const accessToken = localStorage.getItem("accessToken");
  // const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(null);

  const location = useLocation();
  const nav = useNavigate();

  // Activity
  const [deleteActivity, setDeleteActivity] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState("");
  const [confirmActivity, setConfirmActivity] = useState("");
  const [activityModal, setActivityModal] = useState({ visible: false, activityName: "" });
  const [createActivityModal, setCreateActivityModal] = useState(false);
  const [activityName, setActivityName] = useState("");
  //Sprint
  const [completedSprint, setCompletedSprint] = useState(false);


  // api
  const authAPI = "http://localhost:9999/auth";
  const userApi = "http://localhost:9999/users";

  // State lưu thông tin user & accessToken




  //parameter
  const [user, setUser] = useState({});





  //call api
  useEffect(() => {
    if(location.pathname !== '/login'){
      localStorage.setItem("lastVisitedUrl", location.pathname);
    }
    if(!excludedRoutes.includes(location.pathname)){
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

  //fuction
  const changePassword = async (userId, oldPassword, newPassword) => {
    try {
      const response = await axios.put(`${userApi}/change-password`, {
        userId,
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const showNotification = (message, description) => {
    notification.info({
      message: message,
      description: description,
      placement: "bottomRight",
    });
  };
  //create activity
  const handleActivityCreate = () => {
    if (activityName.trim()) {
      message.success(`Activity "${activityName}" created successfully!`);
      showNotification(`Project update`, `User1 just created activity "${activityName}".`);
      setActivityName("");
      setCreateActivityModal(false);
    }
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
      console.log("check login status successfully, last visited url: ", lastVisitedUrl);
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
  const showActivity = (activityName) => {
    setActivityModal({ visible: true, activityName });
  };

  const closeActivity = () => {
    setActivityModal({ visible: false, activityName: "" });
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
      authAPI,
      accessToken,
      user, setUser,
      //    setAccessToken,
      defaultSelectedKeys, setDefaultSelectedKeys,
      showNotification,
      showDeleteActivity, handleDelete, handleCloseDeleteActivityModal, deleteActivity, setDeleteActivity, activityToDelete, setActivityToDelete, confirmActivity, setConfirmActivity,
      activityModal, setActivityModal, showActivity, closeActivity,
      handleActivityCreate,createActivityModal, setCreateActivityModal,activityName, setActivityName,
      completedSprint, setCompletedSprint, showCompletedSprint, handleCompletedSprint,handleCompletedCancel
    }}>
      {children}
    </AppContext.Provider>
  );
};


export default AppProvider;