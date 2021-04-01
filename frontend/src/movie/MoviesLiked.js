import { List } from 'antd';
import React from 'react';
import MovieCard from './MovieCard.js';

function MoviesLiked (props) {    
    return (
        <div>            
            <List                        
                grid={{
                    gutter: 16,
                    xs: 2,
                    sm: 2,
                    md: 3,
                    lg: 4,
                    xl: 5,
                    xxl: 5,
                }}                      
                pagination={{ pageSize: 10 }}                  
                style={{ marginTop: '16px' }}                
                dataSource={props.movies ? props.movies : undefined}
                renderItem={item => (
                    <List.Item>
                        <MovieCard movie={item} />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default MoviesLiked;