
import React from "react";
import { Row, Col, Card, Typography, Button, Flex, Menu, Dropdown, Tooltip, Progress, Avatar, Tag } from "antd";
import { cyan, gray, green, grey, greyDark, red } from "@ant-design/colors";
import { DeleteOutlined, EllipsisOutlined, FireOutlined, GroupOutlined, MoreOutlined, SettingOutlined, UpOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import KanbanBody from "./KanbanBody";
import KanbanTitle from "./KanbanTitle";

const { Title } = Typography;

const KanbanBoard = () => {
    const columns = ["To Do", "In Progress", "Review", "Done", "Done 2"];

    return (
        <div style={{ height: "100%", width: "100%", padding:"0 2%", overflowX: "auto", overflowY: "unset" }}>

            <Row gutter={16} style={{
                height: `7%`, position: 'sticky',
                top: 0,
                zIndex: 10, margin: "0 2%", flexWrap: "nowrap"
            }}>

                
                    <KanbanTitle/>
                    
                

            </Row>
            <Row gutter={16} style={{ height: `93%`, margin: "0 2%", flexWrap: "nowrap" }}>

             
                    
                        <KanbanBody/>
                        
                        

             

            </Row>
        </div>
    );
};

export default KanbanBoard;
