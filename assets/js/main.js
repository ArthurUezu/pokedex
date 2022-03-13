Vue.createApp({
    data() {
        return {
            list: [],
            filter: "",
            filterType: "",
            pokedexOpen: false,
            pokemon: {
                sprites:{
                    other:{
                        'official-artwork':{
                            front_default: "",
                        }
                    }
                }
            },
        }
    },
    computed:{
        filteredList() {
        var self = this;
        self.list = self.sortAPI(self.list);
        var result = [];
        for (var i in self.list) {
            var item = self.list[i];
            if (
                (self.filter == "" || self.normalizar(item.name).indexOf(self.normalizar(self.filter)) != -1) &&
                (self.filterType == "" || self.checkType(item.types))
            ) {
                result.push(item);
            }
        }
        return result;
        }
    },
    methods:{
        getAPI(){
            var self = this;
            var pokelist = [];
            fetch("https://pokeapi.co/api/v2/pokemon/?limit=151")
                .then(response => response.json())
                .then(function(data){
                    pokelist = data.results;
                    for(pokemon of pokelist){
                        fetch(pokemon.url)
                        .then(resp => resp.json())
                        .then(function(data){
                            pokemon = data;
                            self.list.push(pokemon);
                        });
                    }
                    // self.list = self.sortAPI(self.list);
                    // console.log(self.list);
                });
        },
        sortAPI(list){
            return list.sort((a,b)=>{
                return a.id - b.id;
            });
        },
        normalizar(value) {
            return value ? (value+'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "") : "";
        },
        checkType(arr){
            var self = this;
            console.log(arr)
            for(item of arr){
                if(item.type.name == self.filterType){
                    return true;
                }
            }
            return false;
        },
        pokedex(item){
            var self = this;
            self.pokedexOpen = true;
            self.pokemon = item;
            console.log(self.pokemon);
        },
    },
    mounted(){
        var self = this;
        self.getAPI();
    }
}).mount('#app');