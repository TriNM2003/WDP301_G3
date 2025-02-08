import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppProvider = ({ children }) => {
    //token

    // api

    //parameter




    //call api

    //fuction

    return (
        <AppContext.Provider value={{
           
        }}>
            {children}
        </AppContext.Provider>
    );
};


export default AppProvider;
