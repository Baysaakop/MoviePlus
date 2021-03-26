import { Grid, Breadcrumb, Col, List, Pagination, Row, Input, Select, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import axios from 'axios';  
import api from '../api';

const { useBreakpoint } = Grid;
const { Option } = Select;
const { Search } = Input;

function MovieList() {
    const screens = useBreakpoint();
    const [form] = Form.useForm();
    const [movies, setMovies] = useState();    
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState();
    const [name, setName] = useState();
    const [genres, setGenres] = useState();     
    const [genre, setGenre] = useState();    
    const [order, setOrder] = useState();    

    useEffect(() => {
        if (!genres) {
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
        }; 
        // let name = getLocationSearch(props.location.search);
        // setSearch(name)
        // form.setFieldsValue({            
        //     name: name           
        // }) 
       getMovies(name, genre, page, order)
    }, [name, genre, page, order])   

    function getMovies(name, genre, page, order) {
        var url = api.movies + "?"
        var params = []
        if (name && name.length > 0) {
            params.push("name=" + name)
        }
        if (genre && genre > 0) {
            params.push("genre=" + genre)
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
            console.log(res.data)                
            setMovies(res.data.results)
            setTotal(res.data.count)
        }).catch(err => {
            console.log(err.message)
        });        
    }

    // function getLocationSearch(value) {    
    //     if (value && value !== null && value.length > 0 && value.includes("=")) {
    //         let res = value.split("=");            
    //         return res[1];
    //     } else {
    //         return "";
    //     }    
    // }

    function onNameSearch(value) {        
        setName(value);
    }

    function selectGenre (value) {        
        setGenre(value);
    }

    function selectOrder (value) {
        setOrder(value);
    }

    function onPageChange (pageNum, pageSize) {        
        setPage(pageNum)
    }

    function showTotal(total) {
        return `Нийт ${total} кино:`;
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
                        Кино
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div style={{ padding: getPadding() }}>
                <Form form={form} layout="vertical" initialValues={{
                    genre: "all",
                    order: "created_at"
                }}>
                    <Row gutter={[16, 16]}>
                        <Col sm={24} md={8}>
                            <Form.Item name="name" label="Кино хайх:">                            
                                <Search placeholder="Киноны нэрээр хайх" onSearch={onNameSearch} enterButton />
                            </Form.Item>
                        </Col>
                        <Col sm={24} md={8}>
                            <Form.Item name="genre" label="Төрөл сонгох">                                
                                <Select                      
                                    // dropdownStyle={{ backgroundColor: '#161b22' }}                                
                                    showSearch                            
                                    style={{ width: '100%' }}
                                    placeholder="Бүгд"                
                                    onChange={selectGenre}
                                    optionFilterProp="children"                                                 
                                >
                                    <Option key="all">Бүгд</Option>
                                    { genres ? (
                                        <>
                                            {genres.map(item => {
                                                return (
                                                    <Option key={item.id}>{item.name}</Option>
                                                )
                                            })}
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                </Select>
                            </Form.Item>                                                    
                        </Col>                                                           
                        <Col sm={24} md={8}>
                            <Form.Item name="order" label="Эрэмбэлэх:">                                
                                <Select                                
                                    showSearch                            
                                    style={{ width: '100%' }}
                                    placeholder="Шинээр нэмэгдсэн"                
                                    onChange={selectOrder}
                                    optionFilterProp="children"                
                                >                                    
                                    <Option key="created_at">Шинээр нэмэгдсэн</Option>
                                    <Option key="releasedate">Нээлтийн огноогоор(2021 - 1900)</Option>
                                    <Option key="score">Үнэлгээгээр(100 - 0)</Option>
                                    <Option key="views">Хандалтаар (100 - 0)</Option>
                                    <Option key="likes">Like-n тоогоор (100 - 0)</Option>        
                                    <Option key="name">Үсгийн дарааллаар (A - Z)</Option>                                    
                                </Select>
                            </Form.Item>  
                        </Col>
                    </Row>
                </Form>
                <List                        
                    grid={{
                        gutter: 16,
                        xs: 2,
                        sm: 2,
                        md: 3,
                        lg: 4,
                        xl: 5,
                        xxl: 6,
                    }}                                        
                    style={{ marginTop: '16px' }}                
                    dataSource={movies ? movies : undefined}
                    renderItem={item => (
                        <List.Item>
                            <MovieCard item={item} />
                        </List.Item>
                    )}
                />
                <Pagination
                    current={page}
                    total={total}
                    pageSize={4}
                    hideOnSinglePage={true}
                    showSizeChanger={false}
                    showTotal={showTotal}
                    onChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default MovieList;