
import _ from "lodash";

const logoDefault = {
    adobj_sampling: [0],
    element_id: [],
    element_sampling: 0,
    filling: -1,
    min_interval: 0,
    partobj_ratio: 10,
    req_timeshift: 0,
    rewind: 0
};

const getDefaultElement = (logo, id, position) => {
    return {
        click_through: "",
        data: litv.config.cdnstatic + logo,
        duration: 0,
        exclusive: false,
        id: id,
        media_type: "image",
        position: position,
        purchase_url: "",
        schema: "litv",
        space_id: id,
        title: "",
        unit_id: "",
        users: "All",
    };
};

const app = (lineup) => {
    let channels = lineup.channels;

    for(let i = 0; i < channels.length; i ++){
        let channel = channels[i];
        let liad = channel.liad;

        if(liad){
            liad = _.cloneDeep(liad);

            if(!liad.elements){
                liad.elements = {};
            }

            if(channel.bl_logo){
                if(!liad.logo_bl){
                    liad.logo_bl = _.cloneDeep(logoDefault);
                }
                else{
                    if(liad.logo_bl.adobj_sampling.indexOf(0) == -1){
                        liad.logo_bl.adobj_sampling.push(0);
                    }

                    liad.logo_bl.element_sampling = 0;
                }

                liad.logo_bl.element_id.push([`bl_logo_${i}`]);

                liad.elements[`bl_logo_${i}`] = getDefaultElement(channel.bl_logo, `bl_logo_${i}`, "BL");
            }

            if(channel.br_logo){
                if(!liad.logo_br){
                    liad.logo_br = _.cloneDeep(logoDefault);
                }
                else{
                    if(liad.logo_br.adobj_sampling.indexOf(0) == -1){
                        liad.logo_br.adobj_sampling.push(0);
                    }
                    
                    liad.logo_br.element_sampling = 0;
                }

                liad.logo_br.element_id.push([`br_logo_${i}`]);

                liad.elements[`br_logo_${i}`] = getDefaultElement(channel.br_logo, `br_logo_${i}`, "BR");
            }

            if(channel.tl_logo){
                if(!liad.logo_tl){
                    liad.logo_tl = _.cloneDeep(logoDefault);
                }
                else{
                    if(liad.logo_tl.adobj_sampling.indexOf(0) == -1){
                        liad.logo_tl.adobj_sampling.push(0);
                    }
                    
                    liad.logo_tl.element_sampling = 0;
                }

                liad.logo_tl.element_id.push([`tl_logo_${i}`]);

                liad.elements[`tl_logo_${i}`] = getDefaultElement(channel.tl_logo, `tl_logo_${i}`, "TL");
            }
            
            if(channel.tr_logo){
                if(!liad.logo_tr){
                    liad.logo_tr = _.cloneDeep(logoDefault);
                }
                else{
                    if(liad.logo_tr.adobj_sampling.indexOf(0) == -1){
                        liad.logo_tr.adobj_sampling.push(0);
                    }
                    
                    liad.logo_tr.element_sampling = 0;
                }

                liad.logo_tr.element_id.push([`tr_logo_${i}`]);

                liad.elements[`tr_logo_${i}`] = getDefaultElement(channel.tr_logo, `tr_logo_${i}`, "TR");
            }

            channel.liad = liad;
        }
    }
    
    return lineup;
};

export default app;