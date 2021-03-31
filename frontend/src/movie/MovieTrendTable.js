import { CheckCircleOutlined, EyeOutlined, LikeOutlined, PlusCircleOutlined, StarOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import React from 'react';

function MovieTrendTable(props) {

    const columns = [
        {
            title: 'Кино',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: <StarOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'score',
            key: 'score',
            align: 'center',
            // render: item => parseInt(item) / 10
        },
        {
            title: <EyeOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'views',
            key: 'views',
            align: 'center',
        },
        {
            title: <LikeOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'likes',
            key: 'likes',
            align: 'center',
        },
        {
            title: <CheckCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'watched',
            key: 'watched',
            align: 'center',
        },
        {
            title: <PlusCircleOutlined style={{ fontSize: '18px' }} />,
            dataIndex: 'watchlist',
            key: 'watchlist',
            align: 'center',
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={props.data} size="small" style={{ marginTop: '16px' }} pagination={false} />
        </div>
    )
}

export default MovieTrendTable;