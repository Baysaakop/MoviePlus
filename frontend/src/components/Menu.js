import React, { useEffect, useState } from 'react';
import './Menu.css';
import { Button, Grid } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { DesktopOutlined, MenuOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as actions from '../store/actions/auth';
// import logo from './onplus-logo.png';
// import axios from 'axios';
// import api from '../api';
const { useBreakpoint } = Grid;

function CustomMenu (props) {    
    const screens = useBreakpoint();    
    const [current, setCurrent] = useState();        
    const [collapsed, setCollapsed] = useState(true);          
    const [scrollTop, setScrollTop] = useState(true);

    useEffect(() => {                
        setCurrent(props.location.pathname)
        if (props.location.pathname === '/') {
            setScrollTop(true)
            window.addEventListener('scroll', onScroll, true);
        } else {
            setScrollTop(false)
        }
    }, [props.location])

    const handleMenuCollapsed = () => {
        setCollapsed(!collapsed);
    }     

    function onScroll() {                
        if (window.scrollY > 0) {
            setScrollTop(false)
        } else {
            setScrollTop(true)
        }        
    }

    const styleHeaderWeb = {        
        background: scrollTop ? 'rgba(0, 0, 0, 0.5)' : props.darkMode ? '#161b22' : '#fff',            
        display: 'flex',
        justifyContent: 'space-around', 
        alignItems: 'center',
        padding: '0 15%',
        height: '80px',    
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)'
    }
    
    const styleHeaderMobile = {
        background: scrollTop ? 'rgba(0, 0, 0, 0.5)' : props.darkMode ? '#161b22' : '#fff',    
        color: scrollTop ? 'rgb(255, 255, 255)' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',       
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 5%',        
        height: '80px',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)'
    }
    
    const styleLogo = {
        display: 'flex',
        justifyContent: 'flex-start', 
        alignItems: 'center',    
        height: '80px'
    }    

    const styleMenuItemMobile = {    
        width: '100%',
        height: '20%',
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
            { screens.xs ? (
                <div>
                    <div style={styleHeaderMobile}>
                        <div>
                            <Link to="/">
                                <div style={styleLogo}>         
                                    <div style={{ display: 'flex', alignItems: 'center' }}>                                        
                                        <DesktopOutlined style={{ fontSize: '24px', color: scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }} />
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
                        <div style={{ width: '100%', height: '90vh', background: props.darkMode ? "#161b22" : "#fff" }}>                            
                            <Button type="text" size="large" style={styleMenuItemMobile} href="/movies">
                                Кино
                            </Button> 
                            <Button type="text" size="large" style={styleMenuItemMobile} href="/series">
                                Цуврал
                            </Button>                            
                            <Button type="text" size="large" style={styleMenuItemMobile} href="/artists">
                                Уран бүтээлч
                            </Button>
                            <Button type="text" size="large" style={styleMenuItemMobile} href="/posts">
                                Нийтлэл
                            </Button>
                            <Button type="text" size="large" style={styleMenuItemMobile} href="/login">
                                Нэвтрэх
                            </Button>                            
                        </div>
                    )}                             
                </div>
            ) : (
                <div style={styleHeaderWeb}>
                    <div style={{ width: '20%', height: '100%', display: 'flex', alignItems: 'center' }}>
                        <Link to="/">
                            <div style={styleLogo}>         
                                <div style={{ display: 'flex', alignItems: 'center' }}>                                    
                                    <DesktopOutlined style={{ fontSize: '24px', color: scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }} />
                                </div>
                                <div style={{ fontSize: '24px', marginLeft: '8px', color: scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }}>                        
                                    Movie+                    
                                </div>                        
                            </div>       
                        </Link>
                    </div>
                    <div style={{ width: '60%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button ghost={scrollTop || props.darkMode} type={current && current.startsWith('/movies') ? 'primary' : 'default' } size="large" href="/movies" style={{ marginLeft: '8px' }}>
                            Кино
                        </Button>
                        <Button ghost={scrollTop || props.darkMode} type={current && current.startsWith('/series') ? 'primary' : 'default' } size="large" href="/series" style={{ marginLeft: '8px' }}>
                            Цуврал
                        </Button>
                        <Button ghost={scrollTop || props.darkMode} type={current && current.startsWith('/artists') ? 'primary' : 'default' } size="large" href="/artists" style={{ marginLeft: '8px' }}>
                            Уран бүтээлч
                        </Button>
                        <Button ghost={scrollTop || props.darkMode} type={current && current.startsWith('/posts') ? 'primary' : 'default' } size="large" href="/posts" style={{ marginLeft: '8px' }}>
                            Нийтлэл
                        </Button>
                    </div>
                    <div style={{ width: '20%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Button ghost={scrollTop || props.darkMode} type={current && current.startsWith('/posts') ? 'primary' : 'default' } size="large" href="/login">
                            Нэвтрэх
                        </Button>
                    </div>                   
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