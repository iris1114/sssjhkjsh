
const app = (programInfo) => {
    let countries = new Array();

    for(let i = 0; i < programInfo.countries.length; i ++){
        let country = programInfo.countries[i];

        countries.push({
            "@type": "Country",
            "name": country.name
        });
    }

    return countries;
};

export default app;
