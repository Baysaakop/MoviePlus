import { Button, Result } from 'antd';
import React from 'react';

const Page404 = (props) => {
    return (
        <div style={{ width: '100%', height: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Result
                status={404}
                title={404}
                subTitle="Уучлаарай, хуудас олдсонгүй."
                extra={<Button type="primary" href="/">Нүүр хуудас руу буцах</Button>}
            />
        </div>
    );
};

export default Page404;
