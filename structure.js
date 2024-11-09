import {ref, computed} from 'vue'
import {header_Object, navBar_Object, content_Object, Searchcontent_Object} from "./layouts.js"


async function getData() {
    const data = await fetch('http://34.96.146.191:2422/api/Movies')
    const rs = await data.json()
    rs.forEach(movie => {
        // console.log(movie.title.includes("the"))
        if (movie.title.toLowerCase().includes("the")){
            console.log(movie)
        }
    });
    // console.log(rs)
}

async function split_fetch(para){
    let _class = para.split("/")
    let url = "http://34.96.146.191:2422"
    let mode_api = ""
    
    switch (_class[0]){
        case "search":
            mode_api = "search"
            url = url + "/api/Movies"
            break;
        case "detail":
            mode_api = "detail"
            if (_class[1] == "movie"){
                url = url + "/api/Movies" 
            }
            else{
                if (_class[1] == "name"){
                    url = url + "/api/Names"
                }
            }
            break;
        case "get":
            mode_api = "get"
            if (_class[1] == "top50"){
                url = url + "/api/Top50Movies" 
            }
            else{
                if (_class[1] == "mostpopular"){
                    url = url + "/api/MostPopularMovies"
                }
            }
            break;
        default:
            break
    }
    //console.log("Adf")
    const data = await fetch(url)
    const rs = await data.json()
    let result = {};
    if (mode_api == "search" || mode_api == "get"){
        if (_class.length == 3){
            let search_str = _class[2].split('?')[0]
            let paras = _class[2].split('?')[1].split('&')
            let filter_rs = []
            if (search_str != ''){
                if (_class[1] == "movie"){
                    for (let i = 0; i < rs.length; i++){
                        // console.log(rs[i]['title'].toLowerCase())
                        // console.log(search_str.toLowerCase())
                        if (rs[i]['title'].toLowerCase().includes(search_str.toLowerCase())){
                            // console.log("Asdf")
                            filter_rs.push(rs[i])
                        }
                    }
                }
                else{
                    for (let i = 0; i < rs.length; i++){
                        for (let j = 0;j < rs[i]['actorList'].length; j++){
                            if (rs[i]['actorList'][j]['name'].toLowerCase().includes(search_str.toLowerCase())){
                                filter_rs.push(rs[i])
                                break;
                            }
                        }
                    }
                }
            }
            else{
                filter_rs = rs
            }
            // console.log(filter_rs)
            let per_page = parseInt(paras[0].split('=')[1])
            let page = parseInt(paras[1].split('=')[1])
            const total = filter_rs.length
            // console.log(filter_rs)
            const total_page = Math.ceil(total/per_page)
            let items = []
            if (per_page*(page) > filter_rs.length){
                items = filter_rs
                per_page = filter_rs.length
                page = 1
            }
            else{
                items = filter_rs.slice((page - 1)*per_page, (per_page)*page)
            }
            result = {'search' : search_str, 'per_page': per_page, 'page' : page, 'total' : total, 'total_page' : total_page, 'items': items}
        }
        else{
            // console.log(rs)
            const per_page = 4
            const page = 1
            const total = rs.length
            const total_page = Math.ceil(total/per_page)
            const items = rs.slice((page - 1)*per_page, (per_page)*page)
            result = {'search' : '', 'per_page': per_page, 'page' : page, 'total' : total, 'total_page' : total_page, 'items': items}
        }
    }
    else{
        // console.log("asdf")
        if (_class.length == 3){
            const id = _class[2]
            const total = rs.length
            // const total_page = Math.ceil(total/per_page)
            for (let i = 0; i < total; i++){
                
                if (rs[i]['id'] === id){
                    result = {'item' : rs[i]}
                    console.log(rs[i])
                    break;
                }
            }
        }
        else{
            const id = "tt0012349"
            const total = rs.length
            // const total_page = Math.ceil(total/per_page)
            for (let i = 0; i < total; i++){
                console.log(rs[i])
                if (rs[i]['id'] === id){
                    result = {'item' : rs[i]}
                    break;
                }
            }    
        }
    }
    //console.log(result)
    return result;
}



// getData()
const data = await split_fetch("search/name/?per_page=6&page=1")
// console.log(data)



export default {
    data(){
        return{
            search : '',
            light: ref(true),
            curr_content: "content_Object"
        }
    },
    provide(){
        return {
            light: computed(() => this.light),
            search: computed(() => this.search)
        }
    },
    methods:{
        Switch_mode(data){
            //console.log("Asdafsd")
            this.light = data
            // console.log(this.light)
        },
        Search_movie(data){
            this.search = data
            // console.log( "asdf")
            this.curr_content = "Searchcontent_Object"
            // console.log(this.curr_content)
            // console.log(this.search)
        },
        return_homePage(data){
            // console.log("Asdf")
            if (data == true){
                this.curr_content = "content_Object";
            }
        }
    },
    components: {header_Object, navBar_Object, content_Object, Searchcontent_Object},
    template:`
    <div class="row my-1 px-1">
        <div class="col-12 mb-2">
            <header_Object @switch-mode="Switch_mode"  />
        </div>
        <div class="col-12 px-0">
            <navBar_Object @search-movie="Search_movie" @return_Page_content="return_homePage"/>
        </div>
    </div>
    <div class="row my-1 px-1">
        <component :is="curr_content"/>
    </div>
    `
}