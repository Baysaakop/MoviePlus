import React, { useState } from 'react';
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
        marginRight: '8px'      
    }

    const styleMenuItemMobile = {    
        width: '100%',
        height: '25%',
        margin: '0',
        padding: '0',
        alignItems: 'center'       
    }    

    return (
        <div>              
            {screens.xs ? (
                <div>
                    <div style={styleHeaderMobile}>
                        <div>
                            <Link to="/">
                                <div style={styleLogo}>         
                                    <div style={{ display: 'flex', alignItems: 'center' }}>                                        
                                        <DesktopOutlined style={{ fontSize: '24px', color: props.darkMode ? '#fff' : '#000' }} />
                                    </div>
                                    <div style={{ fontSize: '24px', marginLeft: '8px', color: props.darkMode ? '#fff' : '#000' }}>                        
                                        Movie+                        
                                    </div>                        
                                </div>       
                            </Link>
                        </div>
                        <div>
                            <Button 
                                size="large"
                                shape="circle" 
                                type="primary" 
                                icon={<MenuOutlined />} 
                                onClick={handleMenuCollapsed} 
                                style={ props.darkMode ? { background: 'transparent', color: '#fff', border: '1px solid #fff' } : { background: 'transparent', color: '#000', border: '1px solid #000' }} 
                            />
                        </div>        
                    </div>   
                    { collapsed ? (
                        <></>
                    ) : (
                        <div style={{ width: '100%', height: '90vh', background: props.darkMode ? "#161b22" : "#fff" }}>                            
                            <Button type="text" size="large" style={styleMenuItemMobile}>
                                Trees
                            </Button> 
                            <Button type="text" size="large" style={styleMenuItemMobile}>
                                News
                            </Button>                            
                            <Button type="text" size="large" style={styleMenuItemMobile}>
                                Members
                            </Button>
                            <Button type="text" size="large" style={styleMenuItemMobile}>
                                Sign In
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
                                    <DesktopOutlined style={{ fontSize: '24px', color: props.darkMode ? '#fff' : '#000' }} />
                                </div>
                                <div style={{ fontSize: '24px', marginLeft: '8px', color: props.darkMode ? '#fff' : '#000' }}>                        
                                    Movie+                    
                                </div>                        
                            </div>       
                        </Link>
                    </div>
                    <div style={{ width: '60%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button type="ghost" shape="round" size="large" style={styleMenuItemWeb}>
                            Кино
                        </Button>
                        <Button type="ghost" shape="round" size="large" style={styleMenuItemWeb}>
                            Уран бүтээлч
                        </Button>
                        <Button type="ghost" shape="round" size="large" style={styleMenuItemWeb}>
                            Нийтлэл
                        </Button>
                    </div>
                    <div style={{ width: '20%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Button type="primary" shape="round" size="large" style={styleMenuItemWeb}>
                            Нэвтрэх
                        </Button>
                        {/* <Button type="primary" shape="round" size="large">
                            Бүртгүүлэх
                        </Button> */}
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