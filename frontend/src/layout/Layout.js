import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import { Layout } from 'antd';
import CustomMenu from '../components/Menu';
import './Layout.css';
import CustomFooter from '../components/CustomFooter';
// import MoonIcon from '../icons/MoonIcon';
// import SunIcon from '../icons/SunIcon';

const { Header, Content, Footer } = Layout;

function CustomLayout (props) {        
    const [darkMode, setDarkMode] = useState(true);    

    useEffect(() => {
        setDarkMode(true)
        localStorage.setItem('dark', JSON.stringify(true));                
    }, [])

    // function getInitialMode() {
    //     const isReturningUser = "dark" in localStorage;
    //     const savedMode = JSON.parse(localStorage.getItem('dark'));
    //     // const userPrefersDark = getPrefColorScheme();
    //     if (isReturningUser) {
    //         return savedMode;
    //     } else {
    //         return true;
    //     }        
    // }

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
    
    // const styleContentSwitch = {
    //     position: 'fixed',
    //     zIndex: '2',
    //     top: '50%',
    //     right: '4%'
    // }
    
    const styleFooter = {    
        background: darkMode ? '#161b22' : '#fff',    
        color: darkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',                        
        minHeight: '200px',
        width: '100%',     
        padding: '0'
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
                {/* <div className="theme-switch-container" style={styleContentSwitch}>
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
                </div> */}
            </Content>
            <Footer className="footer" style={styleFooter}>    
                <CustomFooter />
            </Footer>
        </Layout>
    );  
};

export default CustomLayout;