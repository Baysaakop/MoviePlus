import { Grid, Carousel, Button, Typography, Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import axios from 'axios';  
import api from '../api';
import { InfoCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import moment from 'moment'
import { Link } from 'react-router-dom';
import Trailer from '../components/Trailer';

const { useBreakpoint } = Grid

function HomeCarousel (props) {

    const screens = useBreakpoint()
    const [movies, setMovies] = useState()
    const [trailer, setTrailer] = useState()

    useEffect(() => {     
        axios({
            method: 'GET',
            url: `${api.films}?order=${props.type}`
        }).then(res => {             
            let data = res.data.results                                                         
            setMovies(data.slice(0, 4))               
        }).catch(err => {
            console.log(err.message)
        });
    }, [props.type])    

    function getDirector (members) {
        let result = ""
        members.forEach(member => {
            if (member.role.id === 3) {
                result = result + member.artist.name + ", "
            }
        })
        return result.slice(0, result.length - 2)
    }

    function showTrailer (url) {               
        setTrailer(url)
    }

    function hideTrailer (id) {
        setTrailer(undefined)
    }

    return (
        <div>
            <Carousel autoplay autoplaySpeed={5000} className="carousel" effect="fade" style={{ zIndex: '1' }}>
                    {movies ? movies.map(movie => {
                            return (
                                <div>
                                    <div style={{ margin: screens.xs ? '80px 0 0 0' : '0', padding: 0, width: '100%', height: `${window.screen.availHeight * 0.66}px` }}>
                                        <Link to={`/movies/${movie.id}`}>                                            
                                            {movie.movie.landscape ? (
                                                <div
                                                    style={{
                                                        backgroundImage: `linear-gradient(60deg, rgba(11, 20, 30, 0.6), rgba(22, 35, 49, 0.8)), url(${movie.movie.landscape})`,
                                                        width: '100%',
                                                        height: '100%',
                                                        backgroundPosition: 'center',
                                                        backgroundRepeat: 'no-repeat',
                                                        backgroundSize: 'cover'                                                                                           
                                                    }}
                                                >
                                                </div>
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', backgroundColor: 'linear-gradient(60deg, rgba(11, 20, 30, 0.6), rgba(22, 35, 49, 0.8))' }} />
                                            )}     
                                        </Link>
                                        <div style={{ position: 'absolute', left: screens.xxl ? '15%' : screens.xl ? '10%' : screens.lg ? '8%' : '5%', bottom: '10%', padding: '16px', backgroundColor: 'rgba(0, 0, 0, 0.4)', borderRadius: '4px' }}>
                                            <Typography.Title level={1} style={{ marginBottom: 0 }}>{movie.movie.name}</Typography.Title>                                                                                                                                  
                                            <Typography.Text style={{ fontSize: '16px', display: 'block' }}>Продюсер: {getDirector(movie.movie.members)}</Typography.Text>
                                            <Typography.Text style={{ fontSize: '16px', display: 'block' }}>Нээлт: {moment(movie.movie.releasedate).format("YYYY-MM-DD")}</Typography.Text>
                                            <Typography.Text style={{ fontSize: '16px', display: 'block' }}>Хугацаа: {movie.movie.duration} мин</Typography.Text>
                                            <Button type="ghost" icon={<PlayCircleOutlined />} style={{ marginTop: '8px', marginRight: '8px' }} onClick={() => showTrailer(movie.movie.trailer)}>Трейлер үзэх</Button>
                                            {trailer ? <Trailer title={movie.movie.name} trailer={trailer} hide={() => hideTrailer()} /> : <></>}
                                            <Link to={`/movies/${movie.id}`}>
                                                <Button type="ghost" icon={<InfoCircleOutlined />} style={{ marginTop: '8px' }}>Дэлгэрэнгүй</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : 
                        <Skeleton.Button active size={window.screen.availHeight * 0.66} />                        
                    }                
                </Carousel>                                                                             
        </div>
    )
}

export default HomeCarousel