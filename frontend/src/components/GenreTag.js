import { Tag } from 'antd';
import React, { useEffect, useState } from 'react';

function GenreTag (props) {

    const [color, setColor] = useState();

    useEffect(() => {
        switch(props.genre) {
            case 'Тулаант':
                setColor('#30336b')
                break
            case 'Адал явдалт':
                setColor('#3867d6')
                break
            case 'Намтарчилсан':
                setColor('#0fb9b1')
                break
            case 'Инээдмийн':
                setColor('#fed330')
                break
            case 'Гэмт хэрэг':
                setColor('#d63031')
                break
            case 'Драм':
                setColor('#22a6b3')
                break
            case 'Зөгнөлт':
                setColor('#6ab04c')
                break
            case 'Гангстер':
                setColor('#ffa801')
                break          
            case 'Түүхэн':
                setColor('#05c46b')
                break
            case 'Аймшгийн':
                setColor('#1e272e')
                break
            case 'Хөгжим':
                setColor('#9b59b6')
                break
            case 'Нууцлаг':
                setColor('#2c3e50')
                break
            case 'Хайр дурлал':
                setColor('#c0392b')
                break          
            case 'Ш/У зөгнөлт':
                setColor('#130f40')
                break
            case 'Триллер':
                setColor('#2d3436')
                break
            case 'Дайн':
                setColor('#7f8c8d')
                break
            case 'Вестерн':
                setColor('#f39c12')
                break
            default:
                setColor('#108ee9')
                break
        }
    }, [props.genre])

    return (
        color ? (
            <Tag color={color} style={{ margin: '4px', fontSize: '14px' }}>{props.genre}</Tag>
        ) : (
            <></>
        )       
    )
}

export default GenreTag;