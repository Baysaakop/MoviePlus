import { Grid, Breadcrumb, Typography } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom'

const { useBreakpoint } = Grid

function About () {

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
        <div style={{ minHeight: '80vh', marginTop: '80px' }}>
            <div style={{ padding: getPadding() }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">Нүүр</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Тусламж
                    </Breadcrumb.Item>
                </Breadcrumb>
            </div>
            <div style={{ padding: getPadding() }}>
                <Typography.Title level={4}>Веб сайтын тухай</Typography.Title>
            </div>
        </div>
    )
}

export default About