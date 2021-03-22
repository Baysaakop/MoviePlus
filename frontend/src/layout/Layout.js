import React, { useEffect, useState } from 'react';
import { Button, Layout, Tooltip } from 'antd';
import CustomMenu from '../components/Menu';
import './Layout.css';
import { FacebookFilled, GithubFilled, InstagramOutlined, TwitterOutlined, YoutubeFilled } from '@ant-design/icons';
import SunIcon from '../icons/SunIcon';
import MoonIcon from '../icons/MoonIcon';

const { Header, Content, Footer } = Layout;

function CustomLayout (props) {        
    const [darkMode, setDarkMode] = useState(getInitialMode());
    const [scrollTop, setScrollTop] = useState(true);

    useEffect(() => {
        localStorage.setItem('dark', JSON.stringify(darkMode));        
        window.addEventListener('scroll', onScroll, true);
    }, [darkMode])

    function getInitialMode() {
        const isReturningUser = "dark" in localStorage;
        const savedMode = JSON.parse(localStorage.getItem('dark'));
        const userPrefersDark = getPrefColorScheme();
        if (isReturningUser) {
            return savedMode;
        } else if (userPrefersDark) {
            return true;
        } else {
            return false;
        }        
    }

    function getPrefColorScheme() {
        if (!window.matchMedia) return;

        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function onScroll() {        
        if (window.scrollY > 0) {
            setScrollTop(false)
        } else {
            setScrollTop(true)
        }        
    }

    const styleHeader = {
        background: scrollTop ? 'rgba(0, 0, 0, 0.5)' : darkMode ? '#161b22' : '#fff',    
        color: scrollTop ? 'rgb(255, 255, 255)' : darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',            
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
        right: '6%'
    }
    
    const styleFooter = {    
        background: darkMode ? '#161b22' : '#fff',    
        color: darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
        padding: 0,                            
        minHeight: '200px',
        width: '100%',    
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',    
    }

    return(
        <Layout className={darkMode ? "layout-dark" : "layout-light"} style={{ padding: 0, margin: 0, width: '100%' }} onScroll={onScroll}>
            <Header className="header" style={styleHeader}>
                <CustomMenu {...props} darkMode={darkMode} scrollTop={scrollTop} />                
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
                        © 2021 Tree Plus Project. All Rights Reserved. Designed and developed by On Plus Tech.
                    </p>
                </div>                
            </Footer>
        </Layout>
    );  
};

export default CustomLayout;