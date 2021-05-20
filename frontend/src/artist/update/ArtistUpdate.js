import React, { useEffect, useState } from 'react';
import { Grid, Breadcrumb, Result, Typography, Button, Menu, Row, Col, Spin, message } from 'antd';
import { connect } from "react-redux";
import axios from 'axios';
import api from '../../api';
import { Link } from 'react-router-dom';
import ArtistUpdateInfo from './ArtistUpdateInfo';
import SubMenu from 'antd/lib/menu/SubMenu';
import { DesktopOutlined, LoadingOutlined, SettingOutlined } from '@ant-design/icons';
import MovieIcon from '../../icons/MovieIcon'
import ArtistUpdateCast from './ArtistUpdateCast';
import ArtistUpdateCrew from './ArtistUpdateCrew';

const loadingIcon  = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const { useBreakpoint } = Grid;

function ArtistUpdate (props) {
    const screens = useBreakpoint()
    const [key, setKey] = useState("1")
    const [sub, setSub] = useState(["sub1"])
    const [artist, setArtist] = useState()
    const [loading, setLoading] = useState()

    useEffect(() => {
        getArtist()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    function getArtist() {        
        setLoading(true)
        const id = props.match.params.artistID
        const url = api.artists + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            let target = res.data  
            setArtist(target)
            setLoading(false)
        })
        .catch(err => {
            message.error("Алдаа гарлаа. Та хуудсаа дахин ачааллуулна уу.")
        })
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

    function onSelect (e) {
        setKey(e.key)
    }

    function onSelectSub (keys) {
        setSub(keys)
    }

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            { loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <Spin indicator={loadingIcon} tip="Уншиж байна..." />
                </div>
            ) : (
                <div>
                    { artist ? (
                        <div>
                            <div style={{ padding: getPadding() }}>
                                <Breadcrumb>
                                    <Breadcrumb.Item>
                                        <Link to="/">Нүүр</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to="/artists">Уран бүтээлч</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        <Link to={`/artists/${artist.id}`}>{artist.name}</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item>
                                        Засварлах
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                            </div>
                            { props.token ? (
                                <div style={{ padding: getPadding() }}>
                                    <Typography.Title level={3}>Уран бүтээлч засварлах</Typography.Title>
                                    <Row gutter={[16 ,16]}>
                                        <Col xs={24} sm={24} md={4}>
                                            <Menu mode="inline" theme="dark" style={{ width: '100%', backgroundColor: '#161b22' }} openKeys={sub} selectedKeys={key} onClick={onSelect} onOpenChange={onSelectSub}>
                                                <SubMenu key="sub1" icon={<SettingOutlined />} title="Ерөнхий">
                                                    <Menu.Item key="1">Мэдээлэл</Menu.Item>
                                                    <Menu.Item key="2">Мэргэжил</Menu.Item>
                                                </SubMenu>
                                                <SubMenu key="sub2" icon={<MovieIcon />} title="Кино">
                                                    <Menu.Item key="3">Бүрэлдэхүүн</Menu.Item>
                                                    <Menu.Item key="4">Жүжигчин</Menu.Item>
                                                </SubMenu>
                                                <SubMenu key="sub3" icon={<DesktopOutlined />} title="ТВ Цуврал">
                                                    <Menu.Item key="5">Бүрэлдэхүүн</Menu.Item>
                                                    <Menu.Item key="6">Жүжигчин</Menu.Item>
                                                </SubMenu>
                                            </Menu>  
                                        </Col>
                                        <Col xs={24} sm={24} md={20}>
                                            { 
                                            key === "1" ?
                                                <ArtistUpdateInfo artist={artist} token={props.token} />
                                            : key === "2" ?
                                                <></>
                                            : key === "3" ?
                                                <ArtistUpdateCrew artistID={artist.id} token={props.token} />
                                            : key === "4" ?
                                                <ArtistUpdateCast artistID={artist.id} token={props.token} />
                                            : key === "5" ?
                                                <></>
                                            : key === "6" ?
                                                <></>
                                            : 
                                                <></> 
                                            }
                                        </Col>
                                    </Row>                    
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                                    <Result
                                        status="403"
                                        title="403"
                                        subTitle="Уучлаарай, та эхлээд системд нэвтэрнэ үү."
                                        extra={<Button type="primary" href="/login">Нэвтрэх цонх руу шилжих</Button>}
                                    />
                                </div>
                            )}  
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            )}                      
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ArtistUpdate);