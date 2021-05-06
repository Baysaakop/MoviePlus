import { Grid, Breadcrumb, Col, List, Pagination, Row, Input, Select, Form, Button, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import api from '../api';
import ArtistCard from './ArtistCard';
import { Link } from 'react-router-dom';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';

const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { useBreakpoint } = Grid;
const { Option } = Select;
const { Search } = Input;

function ArtistList () {
    const screens = useBreakpoint()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [artists, setArtists] = useState()    
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState()
    const [name, setName] = useState()
    const [occupations, setOccupations] = useState()    
    const [occupation, setOccupation] = useState(0)   
    const [order, setOrder] = useState('created_at')

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
        setLoading(true)
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
            setLoading(false)
        }).catch(err => {
            console.log(err.message)
            setLoading(false)
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
        return `Нийт ${total} уран бүтээлч:`;
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
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={24} lg={6} xl={6} xxl={5}>
                        <Form form={form} layout="vertical" style={{ border: '1px solid #f1f1f1', borderRadius: '4px', padding: '16px 16px 0 16px' }} initialValues={{
                            order: order
                        }}>
                            <Form.Item name="name" label="Уран бүтээлч хайх:">                            
                                <Search 
                                    placeholder="Уран бүтээлчийн нэрээр хайх" 
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
                                    <Option key="birthday_old">Насаар ахмад</Option>                                    
                                    <Option key="birthday_young">Насаар залуу</Option>                                                                        
                                    <Option key="likes">Хамгийн их Like цуглуулсан</Option>        
                                    <Option key="name">Үсгийн дарааллаар</Option>                                    
                                </Select>
                            </Form.Item> 
                            <Form.Item name="occupation" label="Мэргэжил">
                                <Button type={ occupation.toString() === '0' ? 'primary' : 'ghost' } style={{ margin: '0 8px 8px 0' }} onClick={() => selectOccupation(0)}>Бүгд</Button>
                                <>
                                {occupations ? occupations.map(item => {
                                    return (
                                        <Button type={ item.id.toString() === occupation.toString() ? 'primary' : 'ghost' } style={{ margin: '0 8px 8px 0' }} onClick={() => selectOccupation(item.id)}>{item.name}</Button>
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
                                    xl: 5,
                                    xxl: 5,
                                }}                                                                                      
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
                                pageSize={20}
                                hideOnSinglePage={true}
                                showSizeChanger={false}
                                showTotal={showTotal}
                                onChange={onPageChange}
                                size="small"
                            />
                        </>
                    )}
                    </Col>
                </Row>                                
            </div>
        </div>
    )
}

export default ArtistList;