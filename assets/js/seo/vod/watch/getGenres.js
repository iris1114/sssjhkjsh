
const app = (programInfo) => {
    let genres = new Array();

    for(let i = 0; i < programInfo.genres.length; i ++){
        let genre = programInfo.genres[i];

        genres.push(genre.name);
    }

    return genres;
};

export default app;
