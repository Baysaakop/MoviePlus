import { Grid, Col, message, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../api';
import { LoadingOutlined } from '@ant-design/icons';
import '../movie/MovieDetail.css';
import { connect } from "react-redux";
import Filmography from './Filmography';
import moment from 'moment'

const { useBreakpoint } = Grid;

const spinIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

function ArtistDetail (props) {
    const screens = useBreakpoint()  
    const [artist, setArtist] = useState()            

    useEffect(() => {               
        getArtist()     
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function getArtist() {
        const id = props.match.params.artistID;
        const url = api.artists + "/" + id + "/";  
        axios({
            method: 'GET',
            url: url,
            headers: {
                'Content-Type': 'application/json'                
            }
        })
        .then(res => {
            console.log(res.data)
            setArtist(res.data);
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

    function getAge(date) {
        var years = moment().diff(date, 'years')
        return years
    }

    return (
        <div style={{ marginTop: '80px', minHeight: '80vh' }}>
            { artist ? (
                <div style={{ padding: getPadding(), marginTop: '128px' }} className="detail">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={8} md={8} lg={8} xl={6} style={{ padding: '0 24px' }}>
                            <img src={artist.avatar} alt="avatar" style={{ width: '100%', height: 'auto', borderRadius: '5px', boxShadow: '0 6px 16px -8px rgb(0 0 0 / 32%), 0 9px 28px 0 rgb(0 0 0 / 20%), 0 12px 48px 16px rgb(0 0 0 / 12%)' }} />
                            <Typography.Title level={4} style={{ margin: '16px 0 0 0' }}>Мэргэжил</Typography.Title>
                            {artist.occupation.map(o => {
                                return (                                                
                                    <Typography.Text style={{ fontSize: '16px' }}>{o.name} | </Typography.Text>
                                )                                            
                            })}
                            <Typography.Title level={4} style={{ margin: '16px 0 0 0' }}>Төрсөн өдөр</Typography.Title>
                            <Typography.Text style={{ fontSize: '16px' }}>{artist.birthday ? `${artist.birthday} (${getAge(artist.birthday)} нас)` : '* * * * - * * - * *'}</Typography.Text>
                            {/* <Typography.Title level={4} style={{ margin: '16px 0 0 0' }}>Хүйс</Typography.Title>
                            <Typography.Text style={{ fontSize: '16px' }}>{artist.gender && artist.gender === 'm' ? 'Эр' : artist.gender === 'f' ? 'Эм' : '--'}</Typography.Text> */}
                        </Col>
                        <Col xs={24} sm={16} md={16} lg={16} xl={18}>
                            <div style={{ borderRadius: '5px', height: '100%' }}>
                                <Typography.Title level={1} style={{ marginBottom: '0' }}>{artist.name}</Typography.Title>
                                <Typography.Title level={4}>Танилцуулга</Typography.Title>
                                <Typography.Paragraph style={{ fontSize: '16px' }}>{artist.biography ? artist.biography : 'Maecenas in tellus et nunc scelerisque gravida. Praesent vitae vestibulum nibh. Mauris vitae magna cursus lacus facilisis eleifend ut nec dui. Sed enim dui, maximus non erat id, auctor efficitur dui. Ut tristique pretium interdum. Nam ultrices, nulla eget sollicitudin molestie, ligula leo scelerisque orci, vel pellentesque quam tellus vitae quam. Vestibulum id diam eu ligula faucibus malesuada non sed ante. Vestibulum euismod, nisl nec viverra tristique, nulla tellus mattis quam, sit amet egestas ante quam a orci. Vivamus ut elit magna. Vivamus sed sapien dolor. Donec sollicitudin ligula in diam accumsan, nec consectetur nibh scelerisque. Fusce molestie tincidunt finibus. Nunc hendrerit, libero id rutrum sollicitudin, justo mi imperdiet lorem, vel euismod dolor risus vel libero. Pellentesque metus odio, luctus in dui vitae, tincidunt semper enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Duis fringilla nunc lobortis, eleifend ligula et, ullamcorper sapien.'}</Typography.Paragraph>                                                                                                                                                                                                      
                                <Filmography id={artist.id} occupation={artist.occupation[0].id} />                                           
                            </div>
                        </Col>
                    </Row>
                </div>
            ) : (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <Spin indicator={spinIcon} />
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

export default connect(mapStateToProps)(ArtistDetail);