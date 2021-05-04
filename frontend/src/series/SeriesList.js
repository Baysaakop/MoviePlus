import { Grid, Breadcrumb, Result, Button } from 'antd';
import React from 'react';
// import axios from 'axios';  
// import api from '../api';
import { Link } from 'react-router-dom';
// import MovieCard3 from '../movie/MovieCard3';

// const indicator = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { useBreakpoint } = Grid;
// const { Option } = Select;
// const { Search } = Input;

function SeriesList() {
    const screens = useBreakpoint()
    // const [form] = Form.useForm()
    // const [loading, setLoading] = useState(false)
    // const [series, setSeries] = useState() 
    // const [page, setPage] = useState(1)
    // const [total, setTotal] = useState()
    // const [name, setName] = useState()
    // const [genres, setGenres] = useState()    
    // const [genre, setGenre] = useState()    
    // const [order, setOrder] = useState();   

    // useEffect(() => {
    //     if (!genres) {
    //         axios({
    //             method: 'GET',
    //             url: api.genres
    //         })
    //         .then(res => {                        
    //             setGenres(res.data.results);            
    //         })        
    //         .catch(err => {
    //             console.log(err.message);
    //         }) 
    //     }; 
    //    getSeries(name, genre, page, order)
    // }, [name, genre, page, order])   // eslint-disable-line react-hooks/exhaustive-deps

    // function getSeries(name, genre, page, order) {
    //     setLoading(true)
    //     var url = api.series + "?"
    //     var params = []
    //     if (name && name.length > 0) {
    //         params.push("name=" + name)
    //     }
    //     if (genre && genre > 0) {
    //         params.push("genre=" + genre)
    //     }
    //     if (order) {
    //         params.push("order=" + order)
    //     }
    //     params.forEach(param => {
    //         url += param + "&"
    //     })        
    //     url += "page=" + page                
    //     axios({
    //         method: 'GET',
    //         url: url
    //     }).then(res => {                                         
    //         setSeries(res.data.results)
    //         setTotal(res.data.count)
    //         setLoading(false)
    //     }).catch(err => {
    //         message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
    //         console.log(err.message)
    //         setLoading(false)
    //     });        
    // }

    // function onNameSearch(value) {        
    //     setPage(1)
    //     setName(value)
    // }

    // function selectGenre (value) {        
    //     setPage(1)
    //     setGenre(value)
    // }

    // function selectOrder (value) {
    //     setPage(1)
    //     setOrder(value)
    // }

    // function onPageChange (pageNum, pageSize) {        
    //     setPage(pageNum)
    // }

    // function showTotal(total) {
    //     return `Нийт ${total} кино:`;
    // }

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
                        ТВ Цуврал
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div style={{ padding: getPadding(), display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'  }}>
                <Result
                    status="500"
                    title="Бэлэн биш"
                    subTitle="Уучлаарай, энэ хэсэг одоогоор хөгжүүлэлтийн шатанд явж байна."
                    extra={
                        <Link to="/">
                            <Button type="primary">Нүүр хуудас руу буцах</Button>
                        </Link>
                    }
                />
                {/* <Form form={form} layout="vertical" initialValues={{
                    genre: "all",
                    order: "created_at"
                }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name="name" label="Цуврал хайх:">                            
                                <Search placeholder="Цувралын нэрээр хайх" onSearch={onNameSearch} enterButton />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={8}>
                            <Form.Item name="genre" label="Төрөл жанр сонгох">                                
                                <Select                                                
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
                        <Col xs={24} sm={24} md={24} lg={8}>
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
                                    <Option key="view_count">Хандалтаар (100 - 0)</Option>
                                    <Option key="like_count">Like-n тоогоор (100 - 0)</Option>        
                                    <Option key="name">Үсгийн дарааллаар (A - Z)</Option>                                    
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
                            grid={{
                                gutter: 32,
                                xs: 2,
                                sm: 2,
                                md: 3,
                                lg: 3,
                                xl: 4,
                                xxl: 5,
                            }}                                                            
                            style={{ marginTop: '16px' }}                
                            dataSource={series ? series : undefined}
                            renderItem={item => (
                                <List.Item>
                                    <MovieCard3 movie={item} />
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
                    </>
                )}
                 */}
            </div>
        </div>
    );
};

export default SeriesList;