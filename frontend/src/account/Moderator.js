import { EditOutlined, PlusCircleOutlined, PlusOutlined, ToolOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import React from 'react';
import ArtistAdd from '../artist/ArtistAdd';
import ArtistAddMovie from '../artist/ArtistAddMovie';
import ArtistUpdate from '../artist/ArtistUpdate';
import ArtistUpdateMovie from '../artist/ArtistUpdateMovie';
import MovieAdd from '../movie/MovieAdd';
import MovieUpdate from '../movie/MovieUpdate';

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
                            <MovieUpdate />
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
                        <Tabs.TabPane key="3" tab={<span><PlusCircleOutlined />Кино нэмэх</span>}>
                            <ArtistAddMovie />
                        </Tabs.TabPane>
                        <Tabs.TabPane key="4" tab={<span><EditOutlined />Кино засах</span>}>
                            <ArtistUpdateMovie />
                        </Tabs.TabPane>
                    </Tabs>
                </Tabs.TabPane>
            </Tabs>
        </div>
    )
}

export default Moderator;