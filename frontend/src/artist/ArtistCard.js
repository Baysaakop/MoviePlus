import { Card, Tooltip, Typography } from 'antd';
import React from 'react';
import '../movie/MovieCard.css';
import blank from '../movie/blank.jpg';
import { connect } from "react-redux";

const { Meta } = Card;

function ArtistCard (props) {

    function getOccupation(occupations) {
        const res = []
        occupations.forEach(item => {
            res.push(item.name)
        })
        return res.toString()
    }

    return (
        <div>
            <Card             
                className="moviecard"
                size="small"
                hoverable                 
                style={{ width: '100%', height: 'auto', border: '0' }}                
                cover={
                    <div className="cover-container" style={{ paddingBottom: '150%', overflow: 'hidden' }}>
                        <a href={`/artists/${props.artist.id}`}>
                            <img src={props.artist.avatar ? props.artist.avatar : blank} alt="poster" style={{ position: 'absolute', width: '100%', height: '100%' }} />
                        </a>
                        <div className="cover-overlay-top-left">
                            {/* <Avatar size="large" style={{ background: '#161b22', border: '1px solid orange', color: 'orange', fontFamily: 'Nerko One, cursive', fontSize: '20px' }}>
                                99
                            </Avatar>                                 */}
                        </div>
                    </div>
                }
            >
                <a href={`/artists/${props.artist.id}`}>
                    <Meta 
                        title={<Tooltip title={props.artist.name}>{props.artist.name}</Tooltip>} 
                        description={
                            <Tooltip title={getOccupation(props.artist.occupation)}>
                                <Typography.Paragraph ellipsis={true}>
                                {getOccupation(props.artist.occupation)}
                                </Typography.Paragraph>
                            </Tooltip>
                        } 
                    />
                </a>                     
            </Card>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps)(ArtistCard);