import { blue, cyan, gray, orange, red } from '@ant-design/colors'
import { CalendarOutlined, CloseOutlined, DeleteOutlined, DoubleRightOutlined, DownOutlined, EllipsisOutlined, FireOutlined, FormOutlined, MinusOutlined, MoreOutlined, PaperClipOutlined, PieChartOutlined, UpOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, DatePicker, Dropdown, Flex, List, Menu, Progress, Row, Select, Space, Tooltip, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { Option } from 'antd/es/mentions'
import Title from 'antd/es/typography/Title'
import React from 'react'

function ActivityDetail() {

  return (
    <div>
      <Row justify="space-between" style={{ padding: "1% 2%", borderBottom: `solid 1px ${cyan[`1`]}` }}>
        <Col></Col>
        <Col>
          <Space style={{ padding: 0 }}>
            <Button style={{ borderRadius: 0 }}><EllipsisOutlined /></Button>
            <Button style={{ borderRadius: 0 }} color="danger"><CloseOutlined /></Button>
          </Space>
        </Col>
      </Row>
      <Row justify="space-between" style={{ height: "80vh", padding: "0 2%", overflow: "auto", flexWrap: "wrap" }}>
        <Col span={16} style={{ height: "100%", borderRight: `solid 1px ${cyan[`1`]}` }}>
          <Row justify="space-between" style={{ padding: "1% 0" }}>
            <Col span={15} style={{ padding: "0 1%" }}>
              <Title level={5} style={{ margin: "0" }} ><FormOutlined style={{ color: blue[6] }} /> Task name</Title>
              <Space direction="vertical" style={{ width: "60%", textAlign: "center", padding: "2% 0" }}>
                <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                  <small style={{ fontWeight: "bolder", color: gray[4] }}><PieChartOutlined /> Progress </small>
                  <text ><Progress type="circle" percent={100} size={15} showInfo={false} /> 100%</text>
                </Flex>

                <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                  <small style={{ fontWeight: "bolder", color: gray[4] }}><UserOutlined /> Assignee </small>
                  <Avatar.Group max={{ count: 2 }} size={25}>
                    <Tooltip title="Ant User" placement="top">
                      <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                    </Tooltip>
                    <Tooltip title="Ant User" placement="top">
                      <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                    </Tooltip>
                    <Tooltip title="Ant User" placement="top">
                      <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                    </Tooltip>
                  </Avatar.Group>
                </Flex>
                <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                  <small style={{ fontWeight: "bolder", color: gray[4] }}><CalendarOutlined /> Start date </small>
                  <DatePicker variant="underlined" />
                </Flex>
                <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                  <small style={{ fontWeight: "bolder", color: gray[4] }}><CalendarOutlined /> Due date </small>
                  <DatePicker variant="underlined" />
                </Flex>


              </Space>
            </Col>
            <Col span={5} align="center" style={{ padding: "0 1%" }}>
              <Select

                value="Todo"
                onChange="{setMoveTo}"
                style={{ width: "60%", borderRadius: "0" }}
                dropdownStyle={{ borderRadius: 0 }}

              >
                <Option value="Todo">Todo</Option>
                <Option value="Doing">Doing</Option>
                <Option value="Done">Done</Option>
              </Select>
            </Col>
            <Col span={22} style={{ padding: "0 1%" }}>
              <Space direction="vertical" style={{ width: "100%", textAlign: "center", padding: "2% 0" }}>
                <Flex justify="space-between" align="center" wrap={true} style={{ width: "100%" }}>
                  <text style={{ fontWeight: "bolder", marginBottom: "2%" }}> Description </text>
                  <Flex wrap={true} style={{ width: "100%" }}>
                    <TextArea rows={5} style={{ borderRadius: "2px", marginBottom: "2%" }} placeholder="Add a description" />
                    <Flex justify="end" style={{ width: "100%", marginBottom: "2%" }}>
                      <Space>
                        <Button style={{ borderRadius: "0" }}>Close</Button>
                        <Button style={{ borderRadius: "0" }} variant="solid" color="primary">Save</Button>
                      </Space>
                    </Flex>
                  </Flex>
                </Flex>
                <Flex justify="space-between" align="start" wrap={true} style={{ width: "100%" }}>
                  <text style={{ fontWeight: "bolder", marginBottom: "2%" }}> Subtask </text>
                  <List bordered style={{ width: "100%", borderRadius: "0" }} size='small'>
                    <List.Item style={{ width: "100%", }} >
                      <Row style={{ width: "100%" }}>
                        <Col span={12} align="start">
                          <PaperClipOutlined style={{ color: blue[6] }} />
                          <Typography.Text> Subtask1</Typography.Text>
                        </Col>
                        <Col span={12} align="end">

                          <Space align='center'>
                          <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item key="1" icon={<DoubleRightOutlined rotate="-90" />} style={{color:red[6]}} >
                                    Highest
                                  </Menu.Item>
                                  <Menu.Item key="2" icon={<UpOutlined />} style={{color:orange[6]}} >
                                    High
                                  </Menu.Item>
                                  <Menu.Item key="3" icon={<MinusOutlined />} style={{color:blue[6]}} >
                                    Medium
                                  </Menu.Item>
                                  <Menu.Item key="4" icon={<DownOutlined />} style={{color:cyan[6]}} >
                                    Low
                                  </Menu.Item>
                                  <Menu.Item key="5" icon={<DoubleRightOutlined rotate="90" />} style={{color:cyan[4]}} >
                                    Lowest
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <DoubleRightOutlined rotate="-90" style={{color:red[6]}} onClick={(e) => e.preventDefault()} />
                            </Dropdown> 
                            <Avatar.Group max={{ count: 1 }} size={25}>
                              <Tooltip title="Ant User" placement="top">
                                <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                              </Tooltip>
                              <Tooltip title="Ant User" placement="top">
                                <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                              </Tooltip>
                              <Tooltip title="Ant User" placement="top">
                                <Avatar src="https://i.pinimg.com/736x/45/3c/80/453c80d19293395102b3362b7b74be29.jpg" />
                              </Tooltip>
                            </Avatar.Group>
                            <Select

                              value="Todo"
                              onChange="{setMoveTo}"
                              style={{ borderRadius: "0" }}
                              size="small"
                              dropdownStyle={{ borderRadius: 0 }}

                            >
                              <Option value="Todo">Todo</Option>
                              <Option value="Doing">Doing</Option>
                              <Option value="Done">Done</Option>
                            </Select>
                            <Dropdown
                              overlay={
                                <Menu>
                                  <Menu.Item key="1" icon={<DeleteOutlined />} danger >
                                    Remove subtask
                                  </Menu.Item>
                                </Menu>
                              }
                            >
                              <EllipsisOutlined onClick={(e) => e.preventDefault()} />
                            </Dropdown>
                          </Space>
                        </Col>
                      </Row>

                    </List.Item>
                              
                  </List>
                </Flex>
              </Space>
            </Col>
          </Row>

        </Col>
        <Col span={7} style={{ height: "80vh", padding: "0 2%", overflow: "auto" }}>Comment</Col>
      </Row>
    </div>
  )
}

export default ActivityDetail
