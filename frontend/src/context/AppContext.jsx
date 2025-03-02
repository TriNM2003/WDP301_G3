import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useLocation, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import authAxios from '../utils/authAxios';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  //parameter
  // const [accessToken,setAccessToken] = useState()
  const accessToken = localStorage.getItem("accessToken");
  // const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState(null);
  const location = useLocation();
  const nav = useNavigate();
  //token
  // useEffect(()=>{
  //     const token =localStorage.getItem("accessToken")|| null;
  //     if(token != null){
  //         setAccessToken(token);
  //     }
  // },[])
  // api
  const authAPI = "http://localhost:9999/auth";
  const userApi = "http://localhost:9999/users";

  // State lưu thông tin user & accessToken




  //parameter
  const [user, setUser] = useState({});





  //call api
  useEffect(() => {
    localStorage.setItem("lastVisitedUrl", location.pathname);
    checkLoginStatus();

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

  const checkLoginStatus = () => {
    authAxios.get(`${authAPI}/checkLoginStatus`)
    .then(() => {
      console.log("check login...");
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

  return (
    <AppContext.Provider value={{
      accessToken,
      authAPI,
      accessToken,
      user, setUser,
      //    setAccessToken,
      defaultSelectedKeys, setDefaultSelectedKeys,
      showNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};


export default AppProvider;
