
import TabPane from 'antd/es/tabs/TabPane'
import React, { useContext, useEffect, useState } from 'react'

import Title from 'antd/es/typography/Title'


import { red } from '@ant-design/colors'
import { BarChartOutlined, BarsOutlined, DeleteOutlined, GroupOutlined, MoreOutlined, SettingOutlined, SyncOutlined, TableOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Flex, Menu, Row, Space, Tabs } from 'antd'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'

function _id() {
    const { project, setProject, projects, setProjects,siteAPI, site,activties, setActivities,accessToken } = useContext(AppContext);
    const { projectSlug } = useParams();
    useEffect(() => {
        const project = projects?.find((p) => p.projectSlug == projectSlug)
        // console.log('Selected project:', projectSlug);
        if (project && site) {
            axios.get(`${siteAPI}/${site._id}/projects/${project?._id}/activities/get-by-project-id`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    setActivities(res.data.activities);
                })
                .catch((err) => {
                    console.error("Error fetching projects in site:", err);
                });
        }
    }, [projectSlug, site, projects]);
    return (
        <Flex vertical style={{ height: "100%" }}>
            <Outlet />
        </Flex>
    )
}

export default _id
