import React, { useState } from 'react';
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
    const [collapsed, setCollapsed] = useState(true);          

    const handleMenuCollapsed = () => {
        setCollapsed(!collapsed);
    }     

    const styleHeaderWeb = {        
        display: 'flex',
        justifyContent: 'space-around', 
        alignItems: 'center',
        padding: '0 15%',
        height: '80px',    
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)'
    }
    
    const styleHeaderMobile = {
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingLeft: '5%',
        paddingRight: '8%',
        height: '80px',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%)'
    }
    
    const styleLogo = {
        display: 'flex',
        justifyContent: 'flex-start', 
        alignItems: 'center',    
        height: '80px'
    }    
    
    const styleMenuItemWeb = {    
        marginRight: '8px',        
        color: 'inherit',      
        borderColor: 'inherit'
    }

    const styleMenuItemMobile = {    
        width: '100%',
        height: '20%',
        margin: '0',
        padding: '0',
        alignItems: 'center',
        color: 'inherit',      
        borderColor: 'inherit'
    }    

    return (
        <div className="menu">              
            {screens.xs ? (
                <div>
                    <div style={styleHeaderMobile}>
                        <div>
                            <Link to="/">
                                <div style={styleLogo}>         
                                    <div style={{ display: 'flex', alignItems: 'center' }}>                                        
                                        <DesktopOutlined style={{ fontSize: '24px', color: props.scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }} />
                                    </div>
                                    <div style={{ fontSize: '24px', marginLeft: '8px', color: props.scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }}>                        
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
                                style={{ background: 'transparent', color: 'inherit', borderColor: 'inherit' }} 
                            />
                        </div>        
                    </div>   
                    { collapsed ? (
                        <></>
                    ) : (
                        <div style={{ width: '100%', height: '90vh', background: props.darkMode ? "#161b22" : "#fff" }}>                            
                            <Button type="text" size="large" style={styleMenuItemMobile}>
                                Кино
                            </Button> 
                            <Button type="text" size="large" style={styleMenuItemMobile}>
                                Цуврал
                            </Button>                            
                            <Button type="text" size="large" style={styleMenuItemMobile}>
                                Уран бүтээлч
                            </Button>
                            <Button type="text" size="large" style={styleMenuItemMobile}>
                                Нийтлэл
                            </Button>
                            <Button type="text" size="large" style={styleMenuItemMobile}>
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
                                    <DesktopOutlined style={{ fontSize: '24px', color: props.scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }} />
                                </div>
                                <div style={{ fontSize: '24px', marginLeft: '8px', color: props.scrollTop ? '#fff' : props.darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)' }}>                        
                                    Movie+                    
                                </div>                        
                            </div>       
                        </Link>
                    </div>
                    <div style={{ width: '60%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button type="ghost" shape="round" size="large" style={styleMenuItemWeb} href="/movies">
                            Кино
                        </Button>
                        <Button type="ghost" shape="round" size="large" style={styleMenuItemWeb} href="/series">
                            Цуврал
                        </Button>
                        <Button type="ghost" shape="round" size="large" style={styleMenuItemWeb} href="/artists">
                            Уран бүтээлч
                        </Button>
                        <Button type="ghost" shape="round" size="large" style={styleMenuItemWeb} href="/posts">
                            Нийтлэл
                        </Button>
                    </div>
                    <div style={{ width: '20%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Button danger type="primary" shape="round" size="large">
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