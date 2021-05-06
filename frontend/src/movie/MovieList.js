import { Grid, Breadcrumb, Col, List, Pagination, Row, Input, Select, Form, Spin, message, Button, InputNumber } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import api from '../api';
import { Link } from 'react-router-dom';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';
import MovieCard1 from './cards/MovieCard1';
// import MovieCard2 from './cards/MovieCard2';
import { connect } from 'react-redux';
import moment from 'moment'

const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { useBreakpoint } = Grid;
const { Option } = Select;
const { Search } = Input;

function MovieList(props) {
    const screens = useBreakpoint()
    const [form] = Form.useForm()
    const [user, setUser] = useState()
    const [loading, setLoading] = useState(false)
    const [movies, setMovies] = useState() 
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState()
    const [name, setName] = useState()
    const [genres, setGenres] = useState()    
    const [genre, setGenre] = useState(0)    
    const [order, setOrder] = useState('created_at')  
    const [yearFrom, setYearFrom] = useState(1900) 
    const [yearTo, setYearTo] = useState(moment().year()) 

    useEffect(() => {
        if (!genres) {
            getGenres()
        }
        if (!user) {
            getUser()
        }
       getMovies()
    }, [name, genre, page, order])   // eslint-disable-line react-hooks/exhaustive-deps

    function getGenres() {
        axios({
            method: 'GET',
            url: api.genres
        })
        .then(res => {                        
            setGenres(res.data.results);            
        })        
        .catch(err => {
            console.log(err.message);
        }) 
    }

    function getUser() {
        if (props.token && props.token !== null) {
            axios({
                method: 'GET',
                url: api.profile,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${props.token}`
                }
            }).then(res => {                          
                setUser(res.data)                
            }).catch(err => {                
                console.log(err) 
                message.error("Алдаа гарлаа. Хуудсыг дахин ачааллана уу.")           
            })                    
        }
    }

    function getMovies() {
        setLoading(true)
        var url = api.movies + "?"
        var params = []
        if (name && name.length > 0) {
            params.push("name=" + name)
        }
        if (genre && genre > 0) {
            params.push("genre=" + genre)
        }
        if (yearFrom && yearFrom > 0) {
            params.push("yearfrom=" + yearFrom)
        }
        if (yearTo && yearTo > 0) {
            params.push("yearto=" + yearTo)
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
            setMovies(res.data.results)
            setTotal(res.data.count)
            setLoading(false)
        }).catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
            console.log(err.message)
            setLoading(false)
        });        
    }

    function onNameSearch(value) {        
        setPage(1)
        setName(value)
    }

    function selectGenre (value) {        
        setPage(1)
        setGenre(value)
    }

    function selectOrder (value) {
        setPage(1)
        setOrder(value)
    }

    function searchByYear () {
        getMovies()
    }

    function onPageChange (pageNum, pageSize) {        
        setPage(pageNum)
    }

    function showTotal(total) {
        return `Нийт ${total} кино:`;
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

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            <div style={{ padding: getPadding() }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Нүүр</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Кино
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div style={{ padding: getPadding() }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={5}>
                        <Form form={form} layout="vertical" style={{ border: '1px solid #f1f1f1', borderRadius: '4px', padding: '16px 16px 0 16px' }} initialValues={{
                            order: order
                        }}>
                            <Form.Item name="name" label="Кино хайх:">                            
                                <Search 
                                    placeholder="Киноны нэрээр хайх" 
                                    onSearch={onNameSearch} 
                                    enterButton={
                                        <Button type="primary" icon={<SearchOutlined />} style={{ width: '44px', border: '1px solid #FFF' }} ></Button>
                                    } 
                                />
                            </Form.Item>
                            <Form.Item name="order" label="Эрэмбэлэх:">                                
                                <Select                                
                                    showSearch                            
                                    style={{ width: '100%' }}
                                    placeholder="Шинээр нэмэгдсэн"                
                                    onChange={selectOrder}
                                    optionFilterProp="children"                
                                >                                    
                                    <Option key="created_at">Шинээр нэмэгдсэн</Option>
                                    <Option key="releasedate">Шинээр нээлтээ хийсэн</Option>
                                    <Option key="score">Өндөр үнэлгээтэй</Option>
                                    <Option key="view_count">Их үзэлттэй</Option>
                                    <Option key="like_count">Хамгийн их Like цуглуулсан</Option>        
                                    <Option key="name">Үсгийн дарааллаар</Option>                                    
                                </Select>
                            </Form.Item>
                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Form.Item name="yearfrom" label="Он (-оос):" style={{ width: 'calc((100% - 44px) /2)', paddingRight: '8px' }}>                                
                                    <InputNumber defaultValue={yearFrom} min={1900} max={3000} style={{ width: '100%' }} onChange={(value) => setYearFrom(value)} />
                                </Form.Item>
                                <Form.Item name="yearto" label="(хүртэл):" style={{ width: 'calc((100% - 44px) /2)', paddingRight: '8px' }}>                                
                                    <InputNumber defaultValue={yearTo} min={1900} max={3000} style={{ width: '100%' }} onChange={(value) => setYearTo(value)} />
                                </Form.Item>
                                <Form.Item name="search" label={<span style={{ visibility: 'hidden' }}>Хайх</span>} style={{ width: '44px', textAlign: 'right' }}>                                
                                    <Button type="primary" icon={<SearchOutlined />} style={{ width: '100%', border: '1px solid #FFF' }} onClick={searchByYear}></Button>
                                </Form.Item>
                            </div>
                            <Form.Item name="genre" label="Төрөл">
                                <Button type={ genre.toString() === '0' ? 'primary' : 'ghost' } style={{ margin: '0 8px 8px 0' }} onClick={() => selectGenre(0)}>Бүгд</Button>
                                <>
                                {genres ? genres.map(item => {
                                    return (
                                        <Button type={ item.id.toString() === genre.toString() ? 'primary' : 'ghost' } style={{ margin: '0 8px 8px 0' }} onClick={() => selectGenre(item.id)}>{item.name}</Button>
                                    )
                                }) : <></>}
                                </>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={18} xl={18} xxl={19}>
                    { loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center' , alignItems: 'center', width: '100%', height: '70vh'}}>
                            <Spin indicator={indicator} tip="Ачааллаж байна..." />
                        </div>                    
                    ) : (
                        <>
                            <List                        
                                grid={{
                                    gutter: 16,
                                    xs: 2,
                                    sm: 2,
                                    md: 4,
                                    lg: 4,
                                    xl: 4,
                                    xxl: 5,
                                }}                                                                                                           
                                dataSource={movies ? movies : undefined}
                                renderItem={item => (
                                    <List.Item>                                    
                                        <MovieCard1 movie={item} user={user} />
                                    </List.Item>
                                )} 
                                
                            />
                            <Pagination
                                current={page}
                                total={total}
                                pageSize={20}
                                hideOnSinglePage={true}
                                showSizeChanger={false}
                                showTotal={showTotal}
                                size="small"
                                onChange={onPageChange}
                            />
                        </>
                    )}
                    </Col>
                </Row>                
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieList);