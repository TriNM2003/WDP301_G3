import { cyan } from '@ant-design/colors'
import { Layout } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'
import React, { useEffect } from 'react'
import SiteSider from '../../components/Site/Layout/SiteSider'
import SiteContent from '../../components/Site/Layout/SiteContent'  
import { useLocation } from 'react-router-dom'

function _id() {
    let location = useLocation();
    let isManageProject = location.pathname === "/site/project/manage/members";
    console.log(location)
    return (
        <Layout style={{ height: 'calc(100vh - 64px)' }}>
            {!isManageProject && 
                <Sider
                width={"15%"}
             style={{
                height: '100%',
                background: "white",
                borderRight: `solid 1px ${cyan[`1`]}`
            }}>
                <SiteSider />
            </Sider>
            }
            <Content style={{height: '100%', background: "white", overflowX: "unset" }} >
                <SiteContent />

            </Content>
        </Layout>
    )
}

export default _id
