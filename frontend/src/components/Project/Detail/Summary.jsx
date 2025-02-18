import { ArrowUpOutlined, DollarCircleOutlined, PlusCircleFilled, PlusCircleOutlined } from '@ant-design/icons'
import { Card, Col, Row, Statistic } from 'antd'
import React from 'react'

function Summary() {
  return (
    <div style={{ padding: "2% 5%" }}>
      <Row style={{ padding: "2% 0" }} justify="space-between">
        <Col span={5}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" , textAlign:"start"}}>
            <Statistic
              title="Total activities"
              value="500"
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarCircleOutlined />}
            />
            <p>+20 from last week</p>
          </Card>
        </Col>
        <Col span={5}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", textAlign:"start" }}>
            <Statistic
              title="Completed"
              value="200"
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
            />
            <p>in last week</p>
          </Card>
        </Col>
        <Col span={5}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" , textAlign:"start"}}>
            <Statistic
              title="Total Revenue"
              value="$45,231.89"
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarCircleOutlined />}
            />
            <p>+20.1% from last month</p>
          </Card>
        </Col>
        <Col span={5}>
          <Card style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" , textAlign:"start"}}>
            <Statistic
              title="Total Revenue"
              value="$45,231.89"
              valueStyle={{ color: "#3f8600" }}
              prefix={<DollarCircleOutlined />}
            />
            <p>+20.1% from last month</p>
          </Card>
        </Col>
      </Row>
      <Row style={{ padding: "2% 0" }} justify="space-between">
        <Col span={5}>1</Col>
        <Col span={5}>1</Col>
        <Col span={5}>1</Col>

      </Row>
    </div>
  )
}

export default Summary
