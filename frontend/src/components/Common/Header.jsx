import React, { useContext, useEffect } from 'react'
import { Button, Col, Flex, Menu, Row, Text, Typography } from 'antd'
import { blue } from '@ant-design/colors'
import Title from 'antd/es/typography/Title'
import MenuItem from 'antd/es/menu/MenuItem';
import{MailOutlined } from '@ant-design/icons'
function Header() {
  return (
    <Row justify="space-between" style={{ height: "100%", backgroundColor: "#fff", padding: "0 20px" }} >
            <Col span={3} align="start">
                <Flex justify='center' align='center' style={{ height: "100%" }}>
                    <Title level={3} style={{ margin: 0 }} >HipDaHop</Title>
                </Flex>
            </Col>
            <Col span={12} align="start" >
                {/* <Flex justify='start' align='center'  style={{ height: "100%" }}>
                    <Menu mode="horizontal">
                        <MenuItem icon={<MailOutlined />}  title="Item1">Icon</MenuItem>
                        <MenuItem icon={<MailOutlined />}  title="Item2">Icon</MenuItem>
                        <MenuItem icon={<MailOutlined />}  title="Item3">Icon</MenuItem>
                        <MenuItem icon={<MailOutlined />}  title="Item4">Icon</MenuItem>
                        <MenuItem icon={<MailOutlined />}  title="Item5">Icon</MenuItem>
                    </Menu>
                </Flex> */}
            </Col>
            <Col span={8} >
                <Flex gap="small" justify='end' align='center' style={{ height: "100%" }}>
                    <Button href='#' shape='default' color='primary' variant='solid'>Login</Button>
                    <Button href='#' shape='default' color='warning' variant='solid'>Register</Button>
                </Flex>
            </Col>
        </Row>
  )
}

export default Header
