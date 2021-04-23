// const baseUrl = "http://192.168.0.113:8000/"
const baseUrl = "http://127.0.0.1:8000/"

const api = {
    movies: baseUrl + 'api/movies/movies',
    series: baseUrl + 'api/movies/series',
    ratings: baseUrl + 'api/movies/ratings',
    genres: baseUrl + 'api/movies/genres',
    productions: baseUrl + 'api/movies/productions',
    occupations: baseUrl + 'api/movies/occupations',
    scores: baseUrl + 'api/movies/scores',
    comments: baseUrl + 'api/movies/comments',
    reviews: baseUrl + 'api/movies/reviews',
    artists: baseUrl + 'api/movies/artists',
    members: baseUrl + 'api/movies/members',
    actors: baseUrl + 'api/movies/actors',
    users: baseUrl + 'api/users',
    // signin: baseUrl + 'rest-auth/login/',
    // signup: baseUrl + 'rest-auth/registration/',
    // passwordreset: baseUrl + 'rest-auth/password/reset/',
    // passwordresetconfirm: baseUrl + 'rest-auth/password/reset/confirm/',
    authFacebook: baseUrl + 'rest-auth/facebook/',
    authGoogle: baseUrl + 'rest-auth/google/',
    profile: baseUrl + 'rest-auth/user/',
    mediaItems: baseUrl + 'media/items',
    mediaUsers: baseUrl + 'media/users',
    mediaUploads: baseUrl + 'media/uploads',
    ckeditor: baseUrl + 'ckeditor/',
}

export default api;