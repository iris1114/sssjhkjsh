
const app = (searchProgram) => {
    let pictures = new Array();
    let programs = searchProgram.programs;
    let count = 0;

    for(let i = 0; i < programs.length; i ++){
        if(count >= 10){
            break;
        }

        let program = programs[i];
        let picture = null;

        if(searchProgram.program_publish_pics_type == "l"){
            picture = `${litv.config.cdnstatic}/${program.video_image.replace("-S", "")}`;
        }
        else{
            picture = `${litv.config.cdnstatic}/${program.picture}`;
        }

        pictures.push(picture);
        count ++;
    }
    
    return pictures;
};

export default app;
