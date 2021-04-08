import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Button, Layout, Tooltip } from 'antd';
import CustomMenu from '../components/Menu';
import './Layout.css';
import { FacebookFilled, GithubFilled, InstagramOutlined, TwitterOutlined, YoutubeFilled } from '@ant-design/icons';
import SunIcon from '../icons/SunIcon';
import MoonIcon from '../icons/MoonIcon';

const { Header, Content, Footer } = Layout;

function CustomLayout (props) {        
    const [darkMode, setDarkMode] = useState(getInitialMode());    

    useEffect(() => {
        localStorage.setItem('dark', JSON.stringify(darkMode));                
    }, [darkMode])

    function getInitialMode() {
        const isReturningUser = "dark" in localStorage;
        const savedMode = JSON.parse(localStorage.getItem('dark'));
        // const userPrefersDark = getPrefColorScheme();
        if (isReturningUser) {
            return savedMode;
        } else {
            return true;
        }        
    }

    // function getPrefColorScheme() {
    //     if (!window.matchMedia) return;

    //     return window.matchMedia("(prefers-color-scheme: dark)").matches;
    // }

    const styleHeader = {
        background: 'transparent',          
        display: 'inline-block',
        zIndex: '99', 
        position: 'fixed',      
        padding: '0',    
        margin: '0',
        height: '80px',
        width: '100%',        
    }
    
    const styleContentSwitch = {
        position: 'fixed',
        zIndex: '2',
        top: '50%',
        right: '4%'
    }
    
    const styleFooter = {    
        background: darkMode ? '#161b22' : '#fff',    
        color: darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
        padding: '16px',                            
        minHeight: '200px',
        width: '100%',    
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',    
    }

    return(
        <Layout className={darkMode ? "layout-dark" : "layout-light"} style={{ padding: 0, margin: 0, width: '100%' }}>
            <Header className="header" style={styleHeader}>
                <CustomMenu {...props} darkMode={darkMode} />                
            </Header>
            <Content className="content" style={{ padding: '0',  margin: '0', width: '100%' }}>                                     
                <div className="content-item" style={{ padding: '0', margin: '0', width: '100%' }}>                    
                    {props.children} 
                </div>                
                <div className="theme-switch-container" style={styleContentSwitch}>
                    <Tooltip title={darkMode ? "Switch to Day Mode" : "Switch to Night Mode"}>
                        <Button 
                            type={darkMode ? "primary" : "default"}                
                            size="large"
                            shape="circle"                         
                            style={{ background: 'rgba(0, 0, 0, 0.3)' }}                
                            icon={darkMode ? <MoonIcon style={{ color: '#F4F1C9' }} /> : <SunIcon style={{ color: '#FFD347' }} />} 
                            onClick={() => 
                                setDarkMode(prevMode => !prevMode)                                
                            }
                        />
                    </Tooltip>
                </div>
            </Content>
            <Footer className="footer" style={styleFooter}>                                
                <div>
                    <Tooltip title="Facebook">
                        <Button shape="circle" icon={<FacebookFilled />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <Tooltip title="Twitter">
                        <Button shape="circle" icon={<TwitterOutlined />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <Tooltip title="Instagram">
                        <Button shape="circle" icon={<InstagramOutlined />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <Tooltip title="Youtube">
                        <Button shape="circle" icon={<YoutubeFilled />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <Tooltip title="Github">
                        <Button shape="circle" icon={<GithubFilled />} style={{ margin: '8px' }} size="large" /> 
                    </Tooltip>
                    <p>                                                                       
                        © 2021 Movie Plus Project. All Rights Reserved. Designed and developed by On Plus Tech.
                    </p>
                </div>                
            </Footer>
        </Layout>
    );  
};

export default CustomLayout;