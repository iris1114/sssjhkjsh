
const app = (searchProgram) => {
    let pictures = new Array();
    let programs = searchProgram.programs;

    for(let i = 0; i < programs.length; i ++){
        let program = programs[i];

        if(searchProgram.program_publish_pics_type == "l"){
            pictures.push(`${litv.config.cdnstatic}/${program.video_image.replace("-S", "")}`);
        }
        else{
            pictures.push(`${litv.config.cdnstatic}/${program.picture}`);

            if(program.video_image){
                pictures.push(`${litv.config.cdnstatic}/${program.video_image.replace("-S", "")}`);
            }
        }
    }

    return pictures;
};

export default app;
