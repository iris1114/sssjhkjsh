
const app = (introduction) => {
    let categories = introduction.categories;
    let channels = introduction.channels;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let _categories = channel.categories;

        for(let j = 0; j < _categories.length; j ++){
            let _category = _categories[j];
            let category = categories[_category];

            if(category){
                if(!category.channels){
                    category.channels = new Array();
                }

                category.channels.push(channel);
            }
        }
    }

    return introduction;
};

export default app;
