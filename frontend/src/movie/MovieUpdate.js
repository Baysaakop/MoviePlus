import React from 'react';
import { Grid, Typography, Button, Breadcrumb, Result, Tabs } from 'antd';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import MovieUpdateInfo from './MovieUpdateInfo';
import MovieUpdateCast from './MovieUpdateCast';

const { useBreakpoint } = Grid;

function MovieUpdate (props) {
    const screens = useBreakpoint()

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
                        <Link to="/movies">Кино</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Кино засах
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>        
            { props.token ? (
                <div style={{ padding: getPadding() }}>
                    <Typography.Title level={3}>Кино засах</Typography.Title>
                    <Tabs tabPosition={ screens.xxl || screens.xl || screens.lg ? "left" : "top"}>
                        <Tabs.TabPane tab="Ерөнхий" key="1">
                            <MovieUpdateInfo movieID={props.match.params.movieID} token={props.token} />
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Бүрэлдэхүүн" key="2">

                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Жүжигчид" key="3">
                            <MovieUpdateCast movieID={props.match.params.movieID} token={props.token} />
                        </Tabs.TabPane>
                    </Tabs> 
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
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(MovieUpdate);