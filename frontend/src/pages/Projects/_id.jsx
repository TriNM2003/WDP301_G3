
import TabPane from 'antd/es/tabs/TabPane'
import React, { useContext, useEffect, useState } from 'react'

import Title from 'antd/es/typography/Title'


import { red } from '@ant-design/colors'
import { BarChartOutlined, BarsOutlined, DeleteOutlined, GroupOutlined, MoreOutlined, SettingOutlined, SyncOutlined, TableOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Flex, Menu, Row, Space, Tabs } from 'antd'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'

function _id() {
    const {project, setProject,projects, setProjects}= useContext(AppContext);
    const {projectSlug} = useParams()
    // useEffect(() => {
    //     const currentProject = projects?.find((p)=>{
    //       return p.projectSlug == projectSlug;
    //     })
    //     console.log(projects);
    //     axios.get(`${projectAPI}/${currentProject._id}`,
    //       {
    //         headers: {
    //           'Authorization': `Bearer ${accessToken}`
    //         }
    //       })
    //       .then((res)=>{
    //         setProject(res.data);
    //         console.log(res.data);  
    //       })
    //       .catch((err)=>{
    //         console.log(err);
    //       })
    //   },[projectSlug])
    return (
        <Flex vertical  style={{ height: "100%"}}>
            <Outlet/>
        </Flex>
    )
}

export default _id
