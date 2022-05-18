
const app = (contentId, contentIds) => {
    contentIds = contentIds.filter((element, index, array) => {
        if(contentId == element){
            return false;
        }

        return true;
    });

    contentIds = contentIds.sort(() => {
        return 0.5 - Math.random();
    });

    contentIds.unshift(contentId);

    return contentIds;
};

export default app;
