import React, { useEffect, useState } from 'react';
import axios from 'axios';  
import api from '../api';
import { Grid, Card, List, Avatar, Breadcrumb, Typography } from 'antd';

const { Meta } = Card;
const { useBreakpoint } = Grid;

function PostList (props) {
    const screens = useBreakpoint();
    const [posts, setPosts] = useState();

    useEffect(() => {
        getPosts()
    }, [])

    function getPosts() {
        axios({
            method: 'GET',
            url: api.reviews + "/"
        }).then(res => {                   
            console.log(res.data.results)                       
            setPosts(res.data.results)              
            // setTotal(res.data.count)
        }).catch(err => {
            console.log(err.message)
        });        
    }

    function getPadding() {
        if (screens.xxl) {
            return '24px 15% 0 15%';
        } else if (screens.xl) {
            return '24px 15% 0 15%';
        } else if ( screens.lg) {
            return '24px 15% 0 15%';
        } else if (screens.md) {
            return '16px 5% 0 5%';
        } else if (screens.sm) {
            return '16px 5% 0 5%';
        } else if (screens.xs) {
            return '16px 5% 0 5%';
        }
    }

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            <div style={{ padding: getPadding() }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="/">Нүүр</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Нийтлэл
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div style={{ padding: getPadding() }}>
                <List                        
                    grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2,
                        xl: 3,
                        xxl: 3,
                    }}                                        
                    style={{ marginTop: '16px' }}                
                    dataSource={posts ? posts : undefined}
                    renderItem={item => (                        
                        <List.Item>
                            <a href={`/posts/${item.id}`}>
                                <Card 
                                    hoverable
                                    cover={
                                        <img alt="thumbnail" src={item.thumbnail} />
                                    }
                                    style={{
                                        border: 0
                                    }}
                                >
                                    <Meta
                                        avatar={<Avatar shape="circle" src={item.created_by.profile.avatar} />}
                                        title={item.title}
                                        description={
                                            <Typography.Paragraph ellipsis={{ rows: 4 }}>
                                                <div dangerouslySetInnerHTML={{__html: item.content }} />                                            
                                            </Typography.Paragraph>
                                        }
                                    />
                                </Card>
                            </a>
                        </List.Item>
                    )}
                />
            </div>            
        </div>
    )
}

export default PostList;

