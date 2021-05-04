import React, { useEffect, useState } from 'react';
import axios from 'axios';  
import api from '../api';
import { Link } from 'react-router-dom';
import { Grid, List, Avatar, Breadcrumb, Typography, Button, Pagination, Form, Select, Row, Col, Input, Spin } from 'antd';
import { LikeOutlined, EyeOutlined, StarFilled, DislikeOutlined, CommentOutlined, LoadingOutlined } from '@ant-design/icons';
import moment from 'moment';

const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { useBreakpoint } = Grid;
const { Option } = Select;
const { Search } = Input;

function ReviewList (props) {
    const screens = useBreakpoint()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [posts, setPosts] = useState()
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState()
    const [name, setName] = useState()
    const [order, setOrder] = useState()

    useEffect(() => {
        getPosts()
    }, [name, order, page]) // eslint-disable-line react-hooks/exhaustive-deps

    function getPosts() {
        setLoading(true)
        var url = api.reviews + "?"
        var params = []
        if (name && name.length > 0) {
            params.push("title=" + name)
        }
        if (order) {
            params.push("order=" + order)
        }
        params.forEach(param => {
            url += param + "&"
        })        
        url += "page=" + page    
        axios({
            method: 'GET',
            url: url
        }).then(res => {                                                   
            setPosts(res.data.results)              
            setTotal(res.data.count)
            setLoading(false)
        }).catch(err => {
            console.log(err.message)
            setLoading(false)
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

    function onNameSearch(value) {        
        setPage(1)
        setName(value)
    }

    function selectOrder (value) {
        setPage(1)
        setOrder(value)
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
                <Form form={form} layout="vertical" initialValues={{
                    genre: "all",
                    order: "created_at"
                }}>
                    <Row gutter={[16, 0]}>
                        <Col xs={24} sm={24} md={24} lg={12}>
                            <Form.Item name="name" label="Нийтлэл хайх:">                            
                                <Search placeholder="Нийтлэл нэрээр хайх" onSearch={onNameSearch} enterButton />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12}>
                            <Form.Item name="order" label="Эрэмбэлэх:">                                
                                <Select                                
                                    showSearch                            
                                    style={{ width: '100%' }}
                                    placeholder="Шинээр нэмэгдсэн"                
                                    onChange={selectOrder}
                                    optionFilterProp="children"                
                                >                                    
                                    <Option key="created_at">Шинээр нэмэгдсэн</Option>                                                                        
                                    <Option key="views">Хандалтын тоогоор</Option>
                                    <Option key="likes">Таалагдсан тоогоор</Option>        
                                    <Option key="dislikes">Таалагдаагүй тоогоор</Option>     
                                    <Option key="comments">Сэтгэгдлийн тоогоор</Option>        
                                    <Option key="title">Үсгийн дарааллаар (A - Z)</Option>                                    
                                </Select>
                            </Form.Item>  
                        </Col>
                    </Row>
                </Form>           
                { loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center' , alignItems: 'center', width: '100%', height: '70vh'}}>
                        <Spin indicator={indicator} tip="Ачааллаж байна..." />
                    </div>                    
                ) : (
                    <>
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
                                    <Link to={`/reviews/${item.id}/`}>
                                        <img
                                            width={300}
                                            alt="logo"
                                            src={item.thumbnail}
                                        />
                                    </Link>
                                }
                            >
                                <List.Item.Meta
                                    avatar={<Avatar size={60} src={item.user.profile.avatar} />}
                                    title={<Link to={`/reviews/${item.id}/`}>{item.title}</Link>}
                                    description={
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <Typography.Text>
                                                    Нийтлэсэн: {item.user.username}                     
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
                                                <Typography.Text style={{ fontSize: '16px' }}><LikeOutlined /> {formatCount(item.likes.length)} </Typography.Text>
                                            </div>
                                            <div style={{ marginRight: '16px' }}>
                                                <Typography.Text style={{ fontSize: '16px' }}><DislikeOutlined /> {formatCount(item.dislikes.length)} </Typography.Text>
                                            </div>
                                            <div style={{ marginRight: '16px' }}>
                                                <Typography.Text style={{ fontSize: '16px' }}><CommentOutlined /> {formatCount(item.comments.length)} </Typography.Text>
                                            </div>                           
                                        </div>
                                        <div>
                                            <Link to={`/reviews/${item.id}/`}>
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
                            pageSize={20}
                            hideOnSinglePage={true}
                            showSizeChanger={false}
                            showTotal={showTotal}
                            onChange={onPageChange}
                            size="small"
                        />
                    </>
                )}
            </div>            
        </div>
    )
}

export default ReviewList;

