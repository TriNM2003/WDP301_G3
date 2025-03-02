import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { message, notification } from 'antd';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  //parameter
  // const [accessToken,setAccessToken] = useState()
  const accessToken = localStorage.getItem("accessToken");
  // const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(null);
  // Task
  const [deleteTask, setDeleteTask] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState("");
  const [confirmTask, setConfirmTask] = useState("");
  const [taskModal, setTaskModal] = useState({ visible: false, taskName: "" });
  // api
  const authAPI = "http://localhost:9999/auth";
  const userApi = "http://localhost:9999/users";

  // State lưu thông tin user & accessToken




  //parameter
  const [user, setUser] = useState({});





  //call api
  useEffect(() => {
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
  }, []);

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

  // delete Task
  const showDeleteTask = (taskName) => {
    setTaskToDelete(taskName);
    setDeleteTask(true);
  };

  const handleCloseDeleteTaskModal = () => {
    setDeleteTask(false);
    setConfirmTask(""); // Xóa input khi đóng modal
  };

  const handleDelete = () => {
    if (confirmTask === taskToDelete) {
      message.success(`Task "${taskToDelete}" has been deleted successfully!`);
      showNotification(`Project update`, `User1 just deleted task ${taskToDelete}.`);
      handleCloseDeleteTaskModal();
      closeTask();
    } else {
      message.error("Task name does not match. Please try again!");
    }
  };
  // hien thi Task
  const showTask = (taskName) => {
    setTaskModal({ visible: true, taskName });
  };

  const closeTask = () => {
    setTaskModal({ visible: false, taskName: "" });
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
      showDeleteTask, handleDelete, handleCloseDeleteTaskModal, deleteTask, setDeleteTask, taskToDelete, setTaskToDelete, confirmTask, setConfirmTask,
      taskModal, setTaskModal,showTask,closeTask,
    }}>
      {children}
    </AppContext.Provider>
  );
};


export default AppProvider;
