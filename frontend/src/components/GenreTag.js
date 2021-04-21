import { Tag } from 'antd';
import React from 'react';

function GenreTag (props) {

    // const [color, setColor] = useState();

    // useEffect(() => {
    //     switch(props.genre) {
    //         case 'Action':
    //             setColor('#30336b')
    //             break
    //         case 'Adventure':
    //             setColor('#3867d6')
    //             break
    //         case 'Biography':
    //             setColor('#0fb9b1')
    //             break
    //         case 'Comedy':
    //             setColor('#fed330')
    //             break
    //         case 'Crime':
    //             setColor('#d63031')
    //             break
    //         case 'Drama':
    //             setColor('#22a6b3')
    //             break
    //         case 'Fantasy':
    //             setColor('#6ab04c')
    //             break
    //         case 'Gangster':
    //             setColor('#ffa801')
    //             break          
    //         case 'Historical':
    //             setColor('#05c46b')
    //             break
    //         case 'Horror':
    //             setColor('#1e272e')
    //             break
    //         case 'Musical':
    //             setColor('#9b59b6')
    //             break
    //         case 'Mystery':
    //             setColor('#2c3e50')
    //             break
    //         case 'Romance':
    //             setColor('#c0392b')
    //             break          
    //         case 'Sci-Fi':
    //             setColor('#130f40')
    //             break
    //         case 'Thriller':
    //             setColor('#2d3436')
    //             break
    //         case 'War':
    //             setColor('#7f8c8d')
    //             break
    //         case 'Western':
    //             setColor('#f39c12')
    //             break
    //         default:
    //             setColor('#108ee9')
    //             break
    //     }
    // }, [props.genre])

    return (
        <Tag color="#0d1117" style={{ marginRight: '4px', marginBottom: '4px', fontSize: '16px' }}>{props.genre}</Tag>
        // color ? (
        //     <Tag color="#1e272e" style={{ marginRight: '4px', marginBottom: '4px', fontSize: '14px' }}>{props.genre}</Tag>
        // ) : (
        //     <></>
        // )       
    )
}

export default GenreTag;