import React, { useEffect, useState } from 'react';
import axios from 'axios';  
import api from '../api';
import { Link } from 'react-router-dom';
import { Grid, List, Avatar, Breadcrumb, Typography, Button, Pagination } from 'antd';
import { MessageOutlined, LikeOutlined, EyeOutlined, StarFilled } from '@ant-design/icons';
import moment from 'moment';

const { useBreakpoint } = Grid;

function ReviewList (props) {
    const screens = useBreakpoint();
    const [posts, setPosts] = useState();
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState();

    useEffect(() => {
        getPosts(page)
    }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

    function getPosts() {
        axios({
            method: 'GET',
            url: api.reviews + "?page=" + page
        }).then(res => {                   
            console.log(res.data.results)                       
            setPosts(res.data.results)              
            setTotal(res.data.count)
        }).catch(err => {
            console.log(err.message)
        });        
    }

    function getPadding() {
        if (screens.xxl) {
            return '16px 15%'
        } else if (screens.xl) {
            return '16px 10%'
        } else if (screens.lg) {
            return '16px 8%'
        } else if (screens.md) {
            return '16px 5%'
        } else if (screens.sm) {
            return '16px 5%'
        } else if (screens.xs) {
            return '16px 5%'
        }
    }

    function formatCount(count) {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1).toString() + "M";
        } else if (count >= 1000) {
            return (count / 1000).toFixed(1).toString() + "K";
        } else {
            return count.toString();
        }
    }

    function onPageChange (pageNum, pageSize) {        
        setPage(pageNum)
    }

    function showTotal(total) {
        return `Нийт ${total} нийтлэл:`;
    }

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            <div style={{ padding: getPadding() }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Нүүр</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Нийтлэл
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div style={{ padding: getPadding() }}>                
                <List
                    itemLayout="vertical"
                    size="large"
                    style={{
                        marginBottom: '16px'
                    }}
                    dataSource={posts ? posts : undefined}
                    renderItem={item => (
                    <List.Item
                        key={item.title}
                        extra={
                            <Link to={`/posts/${item.id}`}>
                                <img
                                    width={300}
                                    alt="logo"
                                    src={item.thumbnail}
                                />
                            </Link>
                        }
                    >
                        <List.Item.Meta
                            avatar={<Avatar size={60} src={item.created_by.profile.avatar} />}
                            title={<Link to={`/posts/${item.id}`}>{item.title}</Link>}
                            description={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <Typography.Text>
                                            Нийтлэсэн: {item.created_by.username}                     
                                        </Typography.Text>
                                    </div>
                                    <div>
                                        <Typography.Text style={{ fontSize: '16px' }}>
                                            Оноо: <StarFilled style={{ color: 'orange' }} /> {item.score}/10                                   
                                        </Typography.Text>
                                    </div>                                                                        
                                </div>
                            }                            
                        />
                            <Typography.Paragraph ellipsis={{ rows: 5 }}>
                                <div dangerouslySetInnerHTML={{__html: item.content }} style={{ maxWidth: '1000px' }} />                                                                    
                            </Typography.Paragraph>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Typography.Text>Огноо: {moment(item.created_at).format("YYYY-MM-DD")}</Typography.Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                                    <div style={{ marginRight: '16px' }}>
                                        <Typography.Text style={{ fontSize: '16px' }}><EyeOutlined /> {formatCount(item.views)} </Typography.Text>
                                    </div>
                                    <div style={{ marginRight: '16px' }}>
                                        <Typography.Text style={{ fontSize: '16px' }}><LikeOutlined /> {formatCount(item.likes)} </Typography.Text>
                                    </div>
                                    <div style={{ marginRight: '16px' }}>
                                        <Typography.Text style={{ fontSize: '16px' }}><MessageOutlined /> {formatCount(15)} </Typography.Text>
                                    </div>                           
                                </div>
                                <div>
                                    <Link to={`/posts/${item.id}`}>
                                        <Button type="ghost" style={{ alignSelf: 'flex-end' }}>Унших</Button>
                                    </Link>
                                </div>
                            </div>
                    </List.Item>
                    )}
                />
                <Pagination
                    current={1}
                    total={total}
                    pageSize={24}
                    hideOnSinglePage={true}
                    showSizeChanger={false}
                    showTotal={showTotal}
                    onChange={onPageChange}
                />
            </div>            
        </div>
    )
}

export default ReviewList;

