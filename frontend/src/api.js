// const baseUrl = "http://localhost:8000/"
// const baseUrl = "http://192.168.0.113:8000/"
const baseUrl = "https://movieplusback.herokuapp.com/"

const api = {
    movies: baseUrl + 'api/movies/movies',
    films: baseUrl + 'api/movies/films',
    tempfilms: baseUrl + 'api/movies/tempfilms',
    series: baseUrl + 'api/movies/series',
    ratings: baseUrl + 'api/movies/ratings',
    genres: baseUrl + 'api/movies/genres',
    productions: baseUrl + 'api/movies/productions',
    occupations: baseUrl + 'api/movies/occupations',
    scores: baseUrl + 'api/movies/scores',
    comments: baseUrl + 'api/movies/comments',
    reviews: baseUrl + 'api/movies/reviews',
    tempartists: baseUrl + 'api/movies/tempartists',
    artists: baseUrl + 'api/movies/artists',
    members: baseUrl + 'api/movies/members',
    tempmembers: baseUrl + 'api/movies/tempmembers',
    actors: baseUrl + 'api/movies/actors',
    tempactors: baseUrl + 'api/movies/tempactors',
    users: baseUrl + 'api/users',
    authFacebook: baseUrl + 'rest-auth/facebook/',
    authGoogle: baseUrl + 'rest-auth/google/',
    profile: baseUrl + 'rest-auth/user/',
    mediaItems: baseUrl + 'media/items',
    mediaUsers: baseUrl + 'media/users',    
    mediaUploads: baseUrl + 'media/uploads',
    ckeditor: baseUrl + 'ckeditor/',
}

export default api;