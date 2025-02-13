import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
    //parameter
    // const [accessToken,setAccessToken] = useState()
    const accessToken =localStorage.getItem("accessToken");
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

    

    //parameter
    const [user, setUser] = useState({});




    //call api
    useEffect(() => {
       
            
    });
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

    return (
        <AppContext.Provider value={{
            accessToken,
            authAPI,
            accessToken,
           user, setUser
        }}>
            {children}
        </AppContext.Provider>
    );
};


export default AppProvider;
