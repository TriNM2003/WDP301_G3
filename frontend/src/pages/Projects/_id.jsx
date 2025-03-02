
import TabPane from 'antd/es/tabs/TabPane'
import React, { useState } from 'react'
import Summary from '../../components/Project/Detail/Summary'
import Title from 'antd/es/typography/Title'


import { red } from '@ant-design/colors'
import { BarChartOutlined, BarsOutlined, DeleteOutlined, GroupOutlined, MoreOutlined, SettingOutlined, SyncOutlined, TableOutlined, UserAddOutlined } from '@ant-design/icons'
import { Button, Col, Dropdown, Flex, Menu, Row, Space, Tabs } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

function _id() {
    
    return (
        <Flex vertical  style={{ height: "100%"}}>
            <Outlet/>
        </Flex>
    )
}

export default _id
