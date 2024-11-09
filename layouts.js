import {ref, inject, computed} from 'vue'


export const header_Object = {
    data(){
        return{
            message:  "Helloo",
            light: inject('light'),
        }
    },
    methods:{
        switchMode(event){
            let _mode = event.target.checked
            // console.log(_mode)
            if (_mode == true){
                $("body").css("background-color", "#4d4d4d");
                this.$emit('switchMode', false)
                // console.log("Asdf")
                this.light = ref(false)
            }
            else{
                $("body").css("background-color", "white");
                this.$emit('switchMode', true)
                this.light = ref(true)
            } 
            // const data = new FormData(form);
        },
        bind_class(){
            console.log("asdf")
            computed(() => this.switch)
        }
    },
    template:`
        <div class="row rounded px-3 py-1 color_header_text" :class="light ? 'bg-light-red' : 'bg-dark-red'">
            <div class="col-1 py-2" :class="light ? 'color_header_light_text' : 'color_header_dark_text'">
                <21127239>
            </div>
            <div class="col-10 d-flex justify-content-center">
                <b :class="light ? 'movie_light_info' : 'movie_dark_info'">Movies info</b>
            </div>
            <div class="col-1 d-flex justify-content-end py-2" :class="light ? 'color_header_light_text' : 'color_header_dark_text'">
                <div class="row">
                    <div class="col-6 d-flex justify-content-end">
                        <form class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="switch_mode" @change="switchMode">
                        </form>
                    </div>
                    <div class="col-6">
                        <i :class="light ? 'fa-solid fa-sun' : 'fa-solid fa-moon'"></i>
                    </div>
                </div>
            </div>
        </div> 
        
    `
}

export const navBar_Object = {
    data(){
        return{
            light: inject('light')
        }
    },
    template: `
    <nav class="navbar navbar-expand-md rounded" :class="light ? 'navbar_light_color' : 'navbar_dark_color'">
        <div class="container-fluid">
            <a class="navbar-brand" :class="light ? 'text-dark' : 'text-light'" href="#">
                <i class="fa-solid fa-house"></i>
            </a>
            <form class="d-flex" role="search">
                <input name="search" class="form-control me-2" :class="light ? 'bg-light light_search' : 'bg-dark dark_search'" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-success" type="submit">Search</button>
            </form>
        </div>
    </nav>
    `
}

export const DB_fetch = {
    data(){
        return{
            URL: "http://34.96.146.191:2422"
        }
    },
    methods: {
        async fetch_data(para){
            let _class = para.split("/")
            let url = this.URL
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
    }
}

export const mostPopular_Object = {
    data(){
        return{
            data : {},
            per_page : 3,
            page : 1
        }
    },
    provide(){
        return {
            data: computed(() => this.data),
        }
    },
    methods: {
        
    },
    components:{DB_fetch},
    template:`
    <div class="row">
        <b>
        Most Popular
        </b>
    </div>
    <div class="row">
        <DB_fetch ref="fetch_data"/>
        <div class="col-1">
        </div>
        <div class="col-10">
            <div class="row">
                <div v-for="i in data['items']" class="col-4">
                    <div>
                        <img :src="i.image" style="height:250px; width:100%;">
                    </div>  
                </div>
            </div> 
            
        </div>
        <div class="col-1">
        </div>
    </div>
    `,
    setup(){
        
    },
    async mounted(){
        let promise = await this.$refs.fetch_data.fetch_data('get/mostpopular/?per_page=' + this.per_page + '&page=' + this.page)
        this.data = promise
        // promise.then(value => {
        //     this.data = value
        // }).catch(err => {
        //     this.data = {}
        // })
        // console.log(this.data)
    }
}

export const content_Object = {
    components: {mostPopular_Object},
    template:`
    <div class="col-12">
        <div class="row px-0">
            hhhh
        </div>
        <div class="row px-0">
            <mostPopular_Object/>
        </div>
    </div>
    `
}