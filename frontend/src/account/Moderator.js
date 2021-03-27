import { DeleteOutlined, PlusOutlined, ToolOutlined } from '@ant-design/icons';
import { Tabs, Typography } from 'antd';
import React from 'react';
import ArtistAdd from '../artist/ArtistAdd';
import ArtistUpdate from '../artist/ArtistUpdate';
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
                        <Tabs.TabPane key="2" tab={<span><ToolOutlined />Засах/Устгах</span>}>
                            
                        </Tabs.TabPane>
                    </Tabs>
                </Tabs.TabPane> 
                <Tabs.TabPane tab="Уран бүтээлч" key="2">
                    <Tabs defaultActiveKey="1">
                        <Tabs.TabPane key="1" tab={<span><PlusOutlined />Нэмэх</span>}>
                            <ArtistAdd />
                        </Tabs.TabPane>
                        <Tabs.TabPane key="2" tab={<span><ToolOutlined />Засах/Устгах</span>}>
                            <ArtistUpdate />
                        </Tabs.TabPane>
                    </Tabs>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default Moderator;