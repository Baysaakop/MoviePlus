import { Grid, Breadcrumb, Row, Col, Button } from "antd";
import { Link } from "react-router-dom";

const { useBreakpoint } = Grid;

function Add () {
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
        <div style={{ padding: getPadding(), marginTop: '80px' }}>
            <Breadcrumb>
                <Breadcrumb.Item>
                    <Link to="/">
                        Нүүр
                    </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    Нэмэх
                </Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', marginTop: '24px' }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>
                        <Link to="/newmovie">
                            <Button type="ghost" size="large" style={{ width: '300px', height: '150px', fontSize: '28px' }}>Кино нэмэх</Button>
                        </Link>
                    </Col>
                    <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>
                        <Link to="/newseries">
                            <Button type="ghost" size="large" style={{ width: '300px', height: '150px', fontSize: '28px' }}>ТВ Цуврал нэмэх</Button>
                        </Link>
                    </Col>
                    <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>
                        <Link to="/newartist">
                            <Button type="ghost" size="large" style={{ width: '300px', height: '150px', fontSize: '28px' }}>Уран бүтээлч нэмэх</Button>
                        </Link>
                    </Col>
                    <Col xs={24} sm={24} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px' }}>
                        <Link to="/newreview">
                            <Button type="ghost" size="large" style={{ width: '300px', height: '150px', fontSize: '28px' }}>Нийтлэл оруулах</Button>
                        </Link>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Add