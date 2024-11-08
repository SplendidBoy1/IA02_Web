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