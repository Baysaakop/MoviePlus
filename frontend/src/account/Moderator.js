import { DeleteOutlined, PlusOutlined, ToolOutlined } from '@ant-design/icons';
import { Tabs, Typography } from 'antd';
import React from 'react';
import MovieAdd from '../movie/MovieAdd';

function Moderator (props) {
    return (
        <div>
            <Tabs defaultActiveKey="1">
                <Tabs.TabPane tab="Кино" key="1">                    
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane key="1" tab={<span><PlusOutlined />Нэмэх</span>}>
                            <MovieAdd />
                        </Tabs.TabPane>
                        <Tabs.TabPane key="2" tab={<span><ToolOutlined />Засах</span>}>

                        </Tabs.TabPane>
                        <Tabs.TabPane key="3" tab={<span><DeleteOutlined />Устгах</span>}>

                        </Tabs.TabPane>
                    </Tabs>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Уран бүтээлч" key="2">
                    <Typography.Title level={5}>Уран бүтээлч</Typography.Title>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Төрөл жанр" key="3">
                    <Typography.Title level={5}>Төрөл жанр</Typography.Title>
                </Tabs.TabPane>
                <Tabs.TabPane tab="Ангилал" key="3">
                    <Typography.Title level={5}>Төрөл жанр</Typography.Title>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default Moderator;