import { Card, Tooltip, Typography } from 'antd';
import React from 'react';
import blank from '../movie/cards/blank.jpg';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';

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
                hoverable   
                size="small"
                style={{ border: 0 }}                                            
                cover={
                    <Link to={`/artists/${props.artist.id}`}>
                        <img src={props.artist.avatar ? props.artist.avatar : blank} alt="avatar" style={{ width: '100%' }} />
                    </Link>
                }
            >
                <Link to={`/artists/${props.artist.id}`}>
                    <Meta 
                        title={<Tooltip title={props.artist.name}>{props.artist.name}</Tooltip>} 
                        description={
                            <Typography.Paragraph ellipsis={true} style={{ margin: 0 }}>
                                {getOccupation(props.artist.occupation)}
                            </Typography.Paragraph>
                        } 
                    />
                </Link>                   
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