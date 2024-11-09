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
                $("body").css("background-color", "#1c2220");
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
    methods:{
        return_Page_content(){
            console.log("asdf")
            this.$emit('return_Page_content', true)
        },
        Search_method(event){
            const formdata = new FormData(event.target);
            let search = Object.fromEntries(formdata)['search'];
            // let int_search = parseInt(search);
            console.log(Object.fromEntries(formdata)['mode_search'])
            this.$emit('searchMovie', {search: search, mode_search: Object.fromEntries(formdata)['mode_search']})
            //console.log(search)
        }
    },
    template: `
    <nav class="navbar navbar-expand-md rounded" :class="light ? 'navbar_light_color' : 'navbar_dark_color'">
        <div class="container-fluid">
            <a class="navbar-brand" :class="light ? 'text-dark' : 'text-light'" href="#" @click="return_Page_content">
                <i class="fa-solid fa-house"></i>
            </a>
            <form class="d-flex" role="search" @submit.prevent="Search_method">
                <select class="form-select form-select-sm size_box" name="mode_search" id="mode_search">
                    <option value="movie">Movie</option>
                    <option value="name">Name of Actor</option>
                </select>
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
            URL: "http://34.96.146.191:2422",
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
                    console.log(filter_rs)
                    let per_page = parseInt(paras[0].split('=')[1])
                    let page = parseInt(paras[1].split('=')[1])
                    const total = filter_rs.length
                    // console.log(filter_rs)
                    const total_page = Math.ceil(total/per_page)
                    let items = []
                    if (per_page*(page) > filter_rs.length){
                        items = filter_rs.slice((page - 1)*per_page, filter_rs.length)
                    }
                    // if (per_page*(page) > filter_rs.length){
                    //     items = filter_rs
                    //     per_page = filter_rs.length
                    //     page = 1
                    // }
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
            light: inject('light'),
            data : {},
            per_page : 3,
            page : 1,
            total_page: 0
        }
    },
    provide(){
        return {
            data: computed(() => this.data),
        }
    },
    methods: {
        async load_data(per_page, page){
            let promise = await this.$refs.fetch_data.fetch_data('get/mostpopular/?per_page=' + per_page + '&page=' + page)
            this.data = promise
            this.per_page = per_page
            this.page = page
            this.total_page = this.data['total_page']
            console.log(this.data)
        },
        async play_animation_slide(str_slide){
            // console.log($('#popular_movie'))
            if (str_slide == false){
                $('.popular_movie').addClass("slide_animation_right")
                setTimeout(() => {
                $('.popular_movie').removeClass("slide_animation_right")
              }, 500)
            }
            else{
                $('.popular_movie').addClass("slide_animation_left")
                setTimeout(() => {
                $('.popular_movie').removeClass("slide_animation_left")
              }, 500)
            }
            // asetTimeout($('#popular_movie').removeClass("slide_animation"), 1000)
            console.log("asdfasdffffffffffffffffff")
        },
        click_new_page(per_page, page, str_slide){
            // console.log("Asdf")
            this.load_data(per_page, page)
            this.play_animation_slide(str_slide)
        },
        hover_animation(id){
            console.log(id)
            let str_search = "#" + id + " b"
            // $("#" + id).removeClass("z-1")
            // $("#" + id).addClass("z-3")
            $("#" + id +" img").addClass("animation_hover")
            $(str_search).removeClass("invisible")
            $(str_search).addClass("visible")
        },
        remove_hover(id){
            console.log(id)
            let str_search = "#" + id + " b"
            // $("#" + id).removeClass("z-3")
            // $("#" + id).addClass("z-1")
            console.log($("#" + id).html())
            $("#" + id +" img").removeClass("animation_hover")
            $(str_search).removeClass("visible")
            $(str_search).addClass("invisible")
        }
    },
    components:{DB_fetch},
    template:`
    <div class="row mb-3" :class="light ? 'text-dark' : 'text-light'">
        <b>
        Most Popular
        </b>
    </div>
    <div class="row">
        <DB_fetch ref="fetch_data"/>
        <div class="col-1 d-flex justify-content-end" :class="light ? 'text-dark' : 'text-light'" style="margin: auto; cursor: grab" @click="(page > 1) ? click_new_page(per_page, page - 1, true) : null">
            <i class="fa-solid fa-less-than"></i>
        </div>
        <div class="col-10">
            <div class="row show_popular">
                <div v-for="i in data['items']" class="popular_movie" @mouseover="hover_animation(i.id)" @mouseout="remove_hover(i.id)">
                    <div class="border-3 rounded d-block" :id="i.id">
                        <img class="rounded z-n1" :src="i.image" style="height:250px; width:100%;">
                        <b class="invisible d-flex justify-content-center text-light z-3 position-relative" style="margin-top: -40px">{{i.title}}</b>
                    </div>
                </div>
            </div> 
        </div>
        <div class="col-1" :class="light ? 'text-dark' : 'text-light'" style="margin: auto; cursor: grab" @click="(page < total_page) ? click_new_page(per_page, page + 1, false) : null">
            <i class="fa-solid fa-greater-than"></i>
        </div>
    </div>
    `,
    setup(){
    },
    mounted(){
        this.load_data(3, 1)
        // promise.then(value => {
        //     this.data = value
        // }).catch(err => {
        //     this.data = {}
        // })
        // console.log(this.data)
    }
}

export const topRating_Object = {
    data(){
        return{
            light: inject('light'),
            data : {},
            per_page : 3,
            page : 1,
            total_page: 0,
        }
    },
    provide(){
        return {
            data: computed(() => this.data),
        }
    },
    methods: {
        async load_data(per_page, page){
            let promise = await this.$refs.fetch_data.fetch_data('get/top50/?per_page=' + per_page + '&page=' + page)
            this.data = promise
            this.per_page = per_page
            this.page = page
            this.total_page = this.data['total_page']
            console.log(this.data)
        },
        async play_animation_slide(str_slide){
            // console.log($('#popular_movie'))
            if (str_slide == false){
                $('.top_movie').addClass("slide_animation_right")
                setTimeout(() => {
                $('.top_movie').removeClass("slide_animation_right")
              }, 500)
            }
            else{
                $('.top_movie').addClass("slide_animation_left")
                setTimeout(() => {
                $('.top_movie').removeClass("slide_animation_left")
              }, 500)
            }
            // asetTimeout($('#top_movie').removeClass("slide_animation"), 1000)
            console.log("asdfasdffffffffffffffffff")
        },
        click_new_page(per_page, page, str_slide){
            // console.log("Asdf")
            this.load_data(per_page, page)
            this.play_animation_slide(str_slide)
        },
        hover_animation(id){
            console.log(id)
            let str_search = "#" + id + " p"
            console.log($("#" + id).html())
            $(str_search).removeClass("invisible")
            $(str_search).addClass("visible")
        },
        remove_hover(id){
            console.log(id)
            let str_search = "#" + id + " p"
            console.log($("#" + id).html())
            $(str_search).removeClass("visible")
            $(str_search).addClass("invisible")
        }
    },
    components:{DB_fetch},
    template:`
    <div class="row  mb-3" :class="light ? 'text-dark' : 'text-light'">
        <b>
        Top Rating
        </b>
    </div>
    <div class="row">
        <DB_fetch ref="fetch_data"/>
        <div class="col-1 d-flex justify-content-end" :class="light ? 'text-dark' : 'text-light'" style="margin: auto; cursor: grab" @click="(page > 1) ? click_new_page(per_page, page - 1, true) : null">
            <i class="fa-solid fa-less-than"></i>
        </div>
        <div class="col-10">
            <div class="row show_top">
                <div v-for="i in data['items']" class="top_movie" @mouseover="hover_animation(i.id)" @mouseout="remove_hover(i.id)">
                    <div class="border-3 rounded" :id="i.id">
                        <img class="rounded" :src="i.image" style="height:250px; width:100%;">
                        <p class="invisible">{{i.title}}</p>
                    </div>  
                </div>
            </div> 
        </div>
        <div class="col-1" :class="light ? 'text-dark' : 'text-light'" style="margin: auto; cursor: grab" @click="(page < total_page) ? click_new_page(per_page, page + 1, false) : null">
            <i class="fa-solid fa-greater-than"></i>
        </div>
    </div>
    `,
    setup(){
    },
    mounted(){
        this.load_data(3, 1)
        // promise.then(value => {
        //     this.data = value
        // }).catch(err => {
        //     this.data = {}
        // })
        // console.log(this.data)
    }
}

export const content_Object = {
    components: {mostPopular_Object, topRating_Object},
    template:`
    <div class="col-12">
        <div class="row px-0 mb-5">
            hhhh
        </div>
        <div class="row px-0 mb-5">
            <mostPopular_Object/>
        </div>
        <div class="row px-0 mb-5">
            <topRating_Object/>
        </div>
        <div class="row px-0">
            asdf
        </div>
    </div>
    `
}

export const Searchcontent_Object = {
    data(){
        return {
            light: inject('light'),
            search: inject('search'),
            mode_search: inject('search_mode'),
            per_page: 9,
            page: 1,
            total_page: 0,
            data: {}
        }
    },
    components:{DB_fetch},
    methods:{
        async load_data(mode, search, per_page, page){
            console.log(mode)
            let promise = await this.$refs.fetch_data.fetch_data('search/' + mode + '/' + search + '?per_page=' + per_page + '&page=' + page)
            // console.log("aaa")
            this.data = promise
            console.log(this.data)
            this.per_page = per_page
            this.page = page
            this.total_page = this.data['total_page']
            console.log(this.total_page)
        }
    },
    watch :{
        search : function (val) {
            this.load_data(this.mode_search, this.search, this.per_page, this.page)
        },
        mode_search : function (val) {
            this.load_data(this.mode_search, this.search, this.per_page, this.page)
        }
    }
    ,
    template:`
    <DB_fetch ref="fetch_data"/>
    <div class="row">
        <div class="col-12 show_search  mt-4">
            <div v-for="i in data['items']">
                <div class="card" :class="light ? 'bg-light' : 'bg-dark'">
                    <div class="card-header rounded d-flex justify-content-center">
                        <img class="rounded" :src="i.image" width="300" height="400">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title d-flex justify-content-center" :class="light ? 'text-dark' : 'text-light'">
                            {{i.fullTitle}}
                        </h5>
                        <div class="text-center" style="color: #b3b5b9">
                            [
                            <div style="color: #b3b5b9" class="d-inline-block" v-for="j in i['genreList']">{{j['key']}}&nbsp;</div>
                            ]
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-12">
            <nav aria-label="Page navigation">
                <ul class="pagination">
                    <li v-for="i in total_page" class="page-item">
                        <a @click="load_data(mode_search,search, per_page, i)" :class="{'page-link':true, active:page===i}" href="#">{{i}}
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    `,
    mounted(){
        this.load_data(this.mode_search, this.search, this.per_page, this.page)
        // console.log(this.per_page)
        // console.log(this.total_page)
        // console.log("hahahah")
        // console.log(this.search)
    },
}






