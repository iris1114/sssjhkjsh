

import _ from "lodash";

import menuObject from "../../assets/json/header/menu.json";
import submenuObject from "../../assets/json/header/submenu.json";

import api from "../../assets/js/api/index.js";
import store from "../../redux/store.js";

const app = async () => {
    try{
        let setSubmenu = (menu, content) => {
            menu.description = content.content_name;
            
            let submenu = new Array();
        
            for(let i = 0; i < content.items.length; i ++){
                let item = content.items[i];
        
                if(item.menu_type == "C"){
                    let obj = {
                        title: item.menu_name,
                        target: "_self",
                        href: {
                            pathname: "/[contentType]/searchProgram",
                            query: {
                                categoryId: item.menu_id
                            }
                        },
                        as: `/${content.content_type}/searchProgram?categoryId=${item.menu_id}`
                    };
        
                    if(item.desc_title){
                        obj.description = item.desc_title;
                    }
                    else{
                        obj.description = item.menu_name;
                    }
        
                    submenu.push(obj);
                }
            }
        
            menu.submenu = submenu;
        };
        
        let setFilter = (menu, filter) => {
            let contentType = menu.contentType;
        
            if(contentType && filter[contentType]){
                menu.filter = `/${contentType}/filter`;
        
                menu.submenu.push({
                    title: "進階篩選",
                    target: "_self",
                    description: "進階篩選",
                    href: "/[contentType]/filter",
                    as: `/${contentType}/filter`
                });
            }
            else if(contentType){
                menu.submenu.push({
                    title: "全部",
                    target: "_self",
                    description: "全部",
                    href: "/[contentType]/filter",
                    as: `/${contentType}/filter`
                });
            }
        };
        
        let insertSubmenu = (menu) => {
            let inserts = null;
        
            if(submenuObject[menu.contentType]){
                inserts = submenuObject[menu.contentType];
            }
            else{
                inserts = menu.insert;
            }
            
            if(inserts.length > 0){
                for(let i = 0; i < inserts.length; i ++){
                    let item = inserts[i];
                    let index = item.index;
        
                    menu.submenu.splice(index, 0, item);
                }
            }
        };

        let menus = _.cloneDeep(menuObject.menu);
        let contentTypes = new Array();
        let fetchList = new Array();
        
        for(let i = 0; i < menus.length; i ++){
            let menu = menus[i];

            for(let j = 0; j < menu.length; j ++){
                let item = menu[j];
                let contentType = item.contentType;

                if(contentType && contentType != "channel"){
                    if(contentTypes.indexOf(contentType) == -1){
                        contentTypes.push(contentType);
                        fetchList.push(api.ccc.menu.getFetch(contentType));
                    }
                }
            }
        }

        fetchList.push(api.fino.filter.getFetch());

        let data = await Promise.all(fetchList);

        for(let i = 0; i < menus.length; i ++){
            let menu = menus[i];

            for(let j = 0; j < menu.length; j ++){
                let item = menu[j];
                let contentType = item.contentType;

                if(contentType){
                    let index = contentTypes.indexOf(contentType);
    
                    if(index != -1){
                        let content = data[index];
                        let filterData = data[data.length - 1];

                        setSubmenu(item, content.result.data);
                        setFilter(item, filterData);
                    }
                }
    
                insertSubmenu(item);
            }
        }
    
        store.dispatch({
            type: "menu",
            value: menus
        });
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;

/*
import menuObject from "../../assets/json/header/menu.json";
import submenuObject from "../../assets/json/header/submenu.json";

import api from "../../assets/js/api/index.js";
import store from "../../redux/store.js";

const app = () => {
    try{
        let setSubmenu = (menu, content) => {
            menu.description = content.content_name;
            
            let submenu = new Array();
        
            for(let i = 0; i < content.items.length; i ++){
                let item = content.items[i];
        
                if(item.menu_type == "C"){
                    let obj = {
                        title: item.menu_name,
                        target: "_self",
                        href: {
                            pathname: "/[contentType]/searchProgram",
                            query: {
                                categoryId: item.menu_id
                            }
                        },
                        as: `/${content.content_type}/searchProgram?categoryId=${item.menu_id}`
                    };
        
                    if(item.desc_title){
                        obj.description = item.desc_title;
                    }
                    else{
                        obj.description = item.menu_name;
                    }
        
                    submenu.push(obj);
                }
            }
        
            menu.submenu = submenu;
        };
        
        let setFilter = (menu, filter) => {
            let contentType = menu.contentType;
        
            if(contentType && filter[contentType]){
                menu.filter = `/${contentType}/filter`;
        
                menu.submenu.push({
                    title: "進階篩選",
                    target: "_self",
                    description: "進階篩選",
                    href: "/[contentType]/filter",
                    as: `/${contentType}/filter`
                });
            }
            else if(contentType){
                menu.submenu.push({
                    title: "全部",
                    target: "_self",
                    description: "全部",
                    href: "/[contentType]/filter",
                    as: `/${contentType}/filter`
                });
            }
        };
        
        let insertSubmenu = (menu) => {
            let inserts = null;
        
            if(submenuObject[menu.contentType]){
                inserts = submenuObject[menu.contentType];
            }
            else{
                inserts = menu.insert;
            }
            
            if(inserts.length > 0){
                for(let i = 0; i < inserts.length; i ++){
                    let item = inserts[i];
                    let index = item.index;
        
                    menu.submenu.splice(index, 0, item);
                }
            }
        };

        let init = () => {
            let menus = menuObject.menu;
            let contentTypes = new Array();
            let fetchList = new Array();
            
            for(let i = 0; i < menus.length; i ++){
                let menu = menus[i];

                for(let j = 0; j < menu.length; j ++){
                    let item = menu[j];
                    let contentType = item.contentType;

                    if(contentType && contentType != "channel"){
                        if(contentTypes.indexOf(contentType) == -1){
                            contentTypes.push(contentType);
                            fetchList.push(api.ccc.menu.getFetch(contentType));
                        }
                    }
                }
            }

            fetchList.push(api.fino.filter.getFetch());
        
            Promise.all(fetchList).then((data) => {
                for(let i = 0; i < menus.length; i ++){
                    let menu = menus[i];

                    for(let j = 0; j < menu.length; j ++){
                        let item = menu[j];
                        let contentType = item.contentType;

                        if(contentType){
                            let index = contentTypes.indexOf(contentType);
            
                            if(index != -1){
                                let content = data[index];
                                let filterData = data[data.length - 1];

                                setSubmenu(item, content.result.data);
                                setFilter(item, filterData);
                            }
                        }
            
                        insertSubmenu(item);
                    }
                }
                
                store.dispatch({
                    type: "menu",
                    value: menus
                });
            }).catch((ex) => {
                console.log(ex.stack);
            });
        };

        init();
    }
    catch(ex){
        console.log(ex.stack);
    }
};

export default app;
*/