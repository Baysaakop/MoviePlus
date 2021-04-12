import { Grid, Breadcrumb, Col, List, Pagination, Row, Input, Select, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import api from '../api';
import ArtistCard from './ArtistCard';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;
const { Option } = Select;
const { Search } = Input;

function ArtistList () {
    const screens = useBreakpoint();
    const [form] = Form.useForm();
    const [artists, setArtists] = useState();    
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState();
    const [name, setName] = useState();
    const [occupations, setOccupations] = useState();     
    const [occupation, setOccupation] = useState();    
    const [order, setOrder] = useState();   

    useEffect(() => {
        if (!occupations) {
            axios({
                method: 'GET',
                url: api.occupations
            })
            .then(res => {                        
                setOccupations(res.data.results);            
            })        
            .catch(err => {
                console.log(err.message);
            }) 
        }; 
        getArtists(name, occupation, page, order)
    }, [name, occupation, page, order]) // eslint-disable-line react-hooks/exhaustive-deps

    function getArtists(name, occupation, page, order) {
        var url = api.artists + "?"
        var params = []
        if (name && name.length > 0) {
            params.push("name=" + name)
        }
        if (occupation && occupation > 0) {
            params.push("occupation=" + occupation)
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
            setArtists(res.data.results)
            setTotal(res.data.count)
        }).catch(err => {
            console.log(err.message)
        });        
    }

    function onNameSearch(value) {        
        setPage(1)
        setName(value);
    }

    function selectOccupation (value) {        
        setPage(1)
        setOccupation(value);
    }

    function selectOrder (value) {
        setPage(1)
        setOrder(value);
    }

    function onPageChange (pageNum, pageSize) {        
        setPage(1)
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
                        Уран бүтээлч
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div style={{ padding: getPadding() }}>
                <Form form={form} layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col sm={24} md={8}>
                            <Form.Item name="name" label="Уран бүтээлч хайх:">                            
                                <Search placeholder="Уран бүтээлчийн нэрээр хайх" onSearch={onNameSearch} enterButton />
                            </Form.Item>
                        </Col>
                        <Col sm={24} md={8}>
                            <Form.Item name="occupation" label="Мэргэжил сонгох">                                
                                <Select                                                                                      
                                    showSearch                            
                                    style={{ width: '100%' }}
                                    placeholder="Бүгд"                
                                    onChange={selectOccupation}
                                    optionFilterProp="children"                                                 
                                >
                                    <Option key="all">Бүгд</Option>
                                    { occupations ? (
                                        <>
                                            {occupations.map(item => {
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
                                    <Option key="birthday">Төрсөн өдрөөр(2021 > 1900)</Option>                                    
                                    <Option key="views">Хандалтаар (100 > 0)</Option>
                                    <Option key="likes">Like-n тоогоор (100 > 0)</Option>        
                                    <Option key="name">Үсгийн дарааллаар (A - Z)</Option>                                    
                                </Select>
                            </Form.Item>  
                        </Col>
                    </Row>
                </Form>
                <List                        
                    grid={{
                        gutter: 16,
                        xs: 3,
                        sm: 3,
                        md: 4,
                        lg: 5,
                        xl: 6,
                        xxl: 8,
                    }}                                        
                    style={{ marginTop: '16px' }}                
                    dataSource={artists ? artists : undefined}
                    renderItem={item => (
                        <List.Item>
                            <ArtistCard artist={item} />
                        </List.Item>
                    )}
                />
                <Pagination
                    current={page}
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

export default ArtistList;