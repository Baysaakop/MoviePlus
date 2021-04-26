import React, { useEffect, useState } from 'react';
import './Menu.css';
import { Button, Grid, Avatar } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { MenuOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
// import logo from './onplus-logo.png';
import axios from 'axios';
import api from '../api';
import MovieIcon from '../icons/MovieIcon';

const { useBreakpoint } = Grid;

function CustomMenu (props) {    
    const screens = useBreakpoint();    
    const [current, setCurrent] = useState();        
    const [collapsed, setCollapsed] = useState(true);          
    const [scrollTop, setScrollTop] = useState(true);    
    const [user, setUser] = useState();

    useEffect(() => {                        
        setCurrent(props.location.pathname)        
        window.addEventListener('scroll', onScroll, true)
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
            })
        } else {
            setUser(undefined)
        }        
    }, [props.location, props.token]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleMenuCollapsed = () => {
        setCollapsed(!collapsed);
    }     

    function onScroll() {                
        if (window.scrollY > 0) {
            setScrollTop(false)
        } else {
            if (props.location.pathname === '/') {
                setScrollTop(true)                
            } else {
                setScrollTop(false)
            }            
        }        
    }

    function getPadding() {
        if (screens.xxl) {
            return '0 15%'
        } else if (screens.xl) {
            return '0 10%'
        } else if (screens.lg) {
            return '0 8%'
        } else if (screens.md) {
            return '0 5%'
        } else if (screens.sm) {
            return '0 5%'
        } else if (screens.xs) {
            return '0 5%'
        }
    }

    const styleHeaderWeb = {        
        background: scrollTop ? 'rgba(0, 0, 0, 0)' : props.darkMode ? '#161b22' : '#fff',            
        display: 'flex',
        justifyContent: 'space-around', 
        alignItems: 'center',
        height: '80px',    
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)',
        padding: getPadding()
    }
    
    const styleHeaderMobile = {
        background: scrollTop ? 'rgba(0, 0, 0, 0.5)' : props.darkMode ? '#161b22' : '#fff',    
        color: scrollTop ? 'rgb(255, 255, 255)' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',       
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
        height: '80px',
        // boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)',
        padding: getPadding()
    }
    
    const styleLogo = {
        display: 'flex',
        justifyContent: 'flex-start', 
        alignItems: 'center',    
        height: '80px'
    }    

    const styleMenuItemMobile = {    
        // width: '100%',
        // height: '20%',
        height: '48px',
        margin: '0',
        padding: '0',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: props.darkMode ? '#161b22' : '#fff',    
        color: props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',       
        borderColor: props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',       
    }    

    return (
        <div className="menu" onScroll={onScroll}>              
            { screens.xxl || screens.xl || screens.lg || screens.md ? (
                <div style={styleHeaderWeb}>
                    <div style={{ width: '20%', height: '100%', display: 'flex', alignItems: 'center' }}>
                        <Link to="/">
                            <div style={styleLogo}>         
                                <div style={{ display: 'flex', alignItems: 'center' }}>                                    
                                    <MovieIcon style={{ fontSize: '32px', color: scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }} />
                                </div>
                                <div style={{ fontSize: '24px', marginLeft: '8px', color: scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }}>                        
                                    MOVIE+                    
                                </div>                        
                            </div>       
                        </Link>
                    </div>
                    <div style={{ width: '60%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Link to="/movies">
                            <Button type={current && current.startsWith('/movies') ? 'primary' : 'ghost' } size="large" style={{ marginLeft: '8px', border: 0 }}>
                                КИНО
                            </Button>
                            {/* <Button ghost={scrollTop || props.darkMode} type={current && current.startsWith('/movies') ? 'primary' : 'default' } size="large" style={{ marginLeft: '8px' }}>
                                Кино
                            </Button> */}
                        </Link>
                        <Link to="/series">
                            <Button type={current && current.startsWith('/series') ? 'primary' : 'ghost' } size="large" style={{ marginLeft: '8px', border: 0 }}>
                                ЦУВРАЛ
                            </Button>
                            {/* <Button ghost={scrollTop || props.darkMode} type={current && current.startsWith('/series') ? 'primary' : 'default' } size="large" style={{ marginLeft: '8px' }}>
                                Цуврал
                            </Button> */}
                        </Link>
                        <Link to="/artists">
                            <Button type={current && current.startsWith('/artists') ? 'primary' : 'ghost' } size="large" style={{ marginLeft: '8px', border: 0 }}>
                                У/БҮТЭЭЛЧ
                            </Button>
                            {/* <Button ghost={scrollTop || props.darkMode} type={current && current.startsWith('/artists') ? 'primary' : 'default' } size="large" style={{ marginLeft: '8px' }}>
                                У/Бүтээлч
                            </Button> */}
                        </Link>
                        <Link to="/reviews">
                            <Button type={current && current.startsWith('/reviews') ? 'primary' : 'ghost' } size="large" style={{ marginLeft: '8px', border: 0 }}>
                                НИЙТЛЭЛ
                            </Button>
                            {/* <Button ghost={scrollTop || props.darkMode} type={current && current.startsWith('/posts') ? 'primary' : 'default' } size="large" style={{ marginLeft: '8px' }}>
                                Нийтлэл
                            </Button> */}
                        </Link>
                    </div>
                    <div style={{ width: '20%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        { user ? (
                            <Link to="/profile">
                                {user.profile.avatar ? <Avatar src={user.profile.avatar} size="large" /> : <Avatar icon={<UserOutlined />} size="large" />}
                                <span style={{ marginLeft: '8px', fontSize: '16px', color: scrollTop || props.darkMode ? '#fff' : '#000' }}>{user.username}</span>
                            </Link>
                        ) : (
                            <Link to="/login">
                                <Button type={current && (current.startsWith('/login') || current.startsWith('/signup')) ? 'primary' : 'ghost' } size="large">
                                    НЭВТРЭХ
                                </Button>
                            </Link>
                        )}                        
                    </div>                   
                </div>                                
            ) : (
                <div>
                    <div style={styleHeaderMobile}>
                        <div>
                            <Link to="/">
                                <div style={styleLogo}>         
                                    <div style={{ display: 'flex', alignItems: 'center' }}>                                        
                                        <MovieIcon style={{ fontSize: '32px', color: scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }} />
                                    </div>
                                    <div style={{ fontSize: '24px', marginLeft: '8px', color: scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }}>                        
                                        Movie+                        
                                    </div>                        
                                </div>       
                            </Link>
                        </div>
                        <div>
                            <Button 
                                size="large"
                                shape="circle" 
                                type="ghost" 
                                icon={<MenuOutlined />} 
                                onClick={handleMenuCollapsed} 
                                style={{ background: 'transparent', color: scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)', borderColor: scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }} 
                            />
                        </div>        
                    </div>   
                    { collapsed ? (
                        <></>
                    ) : (
                        <div style={{ background: props.darkMode ? "#161b22" : "#fff" }}>                            
                            <Link to="/movies">
                                <Button block type="text" size="large" style={styleMenuItemMobile}>
                                    Кино
                                </Button> 
                            </Link>
                            <Link to="/series">
                                <Button block type="text" size="large" style={styleMenuItemMobile}>
                                    Цуврал
                                </Button>       
                            </Link>                     
                            <Link to="/artists">
                                <Button block type="text" size="large" style={styleMenuItemMobile}>
                                    Уран бүтээлч
                                </Button>
                            </Link>
                            <Link to="/reviews">
                                <Button block type="text" size="large" style={styleMenuItemMobile}>
                                    Нийтлэл
                                </Button>
                            </Link>
                            { user ? (
                                <Link to="/profile" style={styleMenuItemMobile}>
                                    {user.profile.avatar ? <Avatar src={user.profile.avatar} size="default" /> : <Avatar icon={<UserOutlined />} size="default" />}
                                    <span style={{ marginLeft: '8px', fontSize: '16px', color: scrollTop || props.darkMode ? '#fff' : '#000' }}>{user.username}</span>
                                </Link>
                            ) : (
                                <Link to="/login">
                                    <Button block type="text" size="large" style={styleMenuItemMobile}>
                                        Нэвтрэх
                                    </Button> 
                                </Link>
                            )}                                                                
                        </div>
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

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(actions.logout())        
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomMenu));