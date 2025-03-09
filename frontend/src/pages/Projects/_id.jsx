
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
    const {activity, project, setProject, createActivityModal, projects, setProjects, siteAPI, createSubActivity, site, activties, setActivities, accessToken, sprints, setSprints } = useContext(AppContext);
    const { projectSlug } = useParams();
    useEffect(() => {
        const selectedProject = projects?.find((p) => p.projectSlug == projectSlug)
        setProject(selectedProject);
        // console.log('Selected project:', projectSlug);
        if (selectedProject && site) {
            axios.get(`${siteAPI}/${site._id}/projects/${selectedProject?._id}/activities/get-by-project-id`, {
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

            axios.get(`${siteAPI}/${site._id}/projects/${selectedProject?._id}/sprints/get-by-project`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            })
                .then((res) => {
                    setSprints(res.data.sprints);
                })
                .catch((err) => {
                    console.error("Error fetching projects in site:", err);
                });

        }
        // console.log("da chay lai");
    }, [projectSlug, site, projects, createActivityModal, createSubActivity]);
    return (
        <Flex vertical style={{ height: "100%" }}>
            <Outlet />
        </Flex>
    )
}

export default _id
