import {ref, computed} from 'vue'
import {header_Object, navBar_Object} from "./layouts.js"

export default {
    data(){
        return{
            light: ref(true),
            curr_content: "display_content"
        }
    },
    provide(){
        return {
            light: computed(() => this.light),
        }
    },
    methods:{
        Switch_mode(data){
            console.log("Asdafsd")
            this.light = data
            // console.log(this.light)
        }
    },
    components: {header_Object, navBar_Object},
    template:`
    <div class="row my-1 px-1">
        <div class="col-12 mb-2">
            <header_Object @switch-mode="Switch_mode"/>
        </div>
        <div class="col-12 px-0">
            <navBar_Object/>
        </div>
    </div> 
    `
}