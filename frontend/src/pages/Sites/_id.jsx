import { cyan } from '@ant-design/colors'
import { Layout } from 'antd'
import Sider from 'antd/es/layout/Sider'
import { Content } from 'antd/es/layout/layout'
import React from 'react'
import SiteSider from '../../components/Site/Layout/SiteSider'
import SiteContent from '../../components/Site/Layout/SiteContent'  

function _id() {
    return (
        <Layout style={{ height: 'calc(100vh - 64px)' }}>
            <Sider
                width={"15%"}
             style={{
                height: '100%',
                background: "white",
                borderRight: `solid 1px ${cyan[`1`]}`
            }}>
                <SiteSider />
            </Sider>
            <Content style={{height: '100%', background: "white", overflowX: "unset" }} >
                <SiteContent />

            </Content>
        </Layout>
    )
}

export default _id
