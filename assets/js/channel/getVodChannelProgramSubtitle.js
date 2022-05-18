
const app = (program) => {
    let title = "";

    if(program.title && program.subtitle){
        title = program.title + " - " + program.subtitle;
    }
    else if(program.title){
        title = program.title;
    }
    else if(program.subtitle){
        title = program.subtitle;
    }

    return title;
};

export default app;