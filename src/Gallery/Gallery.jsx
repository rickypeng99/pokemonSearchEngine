import React, { Component } from 'react';
import {Checkbox, Card, Button } from 'semantic-ui-react';
import axios from 'axios';
//import PropTypes from 'prop-types';
import history from '../history.jsx'

require('./Gallery.scss');


class Gallery extends Component {
	constructor() {
		super();
		this.state = {
			pokemons: [],
            filter: ["all"],
            TOTAL_POKEMON_COUNT: 386
		};

		this.filterHandler = this.filterHandler.bind(this);
	}
    

    filterHandler(event, data){
        var filterArray = this.state.filter

        var needAdd = true;

        //when checkbox is checked, need to pop the value
        if(filterArray.includes(data.value)){
            filterArray = filterArray.filter(function(value, index, arr){
                return value !== data.value;
            });
            needAdd = false;
        }

        //when checkbox is unchecked, need to add the value
        if(needAdd){
            filterArray.push(data.value);
            filterArray = filterArray.filter(function(value, index, arr){
                return value !== "all";
            });
        }
        
        //if none of the checkbox is checked, then apply "all" filter
        if(filterArray.length === 0){
            filterArray.push("all");
        }

        this.setState({filter: filterArray});
    }

    componentDidMount(){
        //console.log('I was triggered during componentDidMount')
        //getting all promises 
		var	promises = [];
		var array = new Array(this.state.TOTAL_POKEMON_COUNT); 
		for(var i = 0; i < array.length; i++){
			array[i] = i+1;
		}
        array.forEach(function(index){
			var myUrl = ("https://pokeapi.co/api/v2/pokemon/" + index);
			promises.push(axios
				.get(myUrl)
				.catch((error) =>{
					return axios.get(("https://pokeapi.co/api/v2/pokemon/" + index))
				}))
		});

		//installing all pokemons
        var pokemons = this.state.pokemons;
		axios.all(promises)
		.then(results => {
			var i = 0;
			results.forEach(function(response) {
				pokemons = pokemons.concat(response.data)
				pokemons[i].name = (pokemons[i].name.substring(0,1).toUpperCase() + pokemons[i].name.substring(1))
				i++;
				//console.log(pokemons[0].name)
			})
			this.setState({pokemons: pokemons})
		})
		.catch((error) => {
			console.log(error);
		});
    }

    render(){

        return(
            <div className = "navBar">
                <div className = "innerClass">
                    <img className = "someImage" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png"onClick={()=>history.push("/")} 
                            alt = "Sprite"></img>
                </div>
                <Button className = "button-link" onClick={()=>history.push("/")}>Homepage</Button>
                <div className = "filterList">
                    {/* <Checkbox label='All'  value='all' onChange={this.filterHandler.bind(this)} checked={this.state.filter==='all'}/>  */}
                    <Checkbox label='Bug'  value='bug' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Dragon'  value='dragon' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Ice'  value='ice' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Fighting'  value='fighting' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Fire'  value='fire' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Flying' value='flying' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Grass' value='grass' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Ghost' value='ghost' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Ground' value='ground' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Electric' value='electric' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Normal' value='normal' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Poison' value='poison' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Psychic' value='psychic' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Rock' value='rock' onChange={this.filterHandler.bind(this)}/> 
                    <Checkbox label='Water' value='water' onChange={this.filterHandler.bind(this)}/> 
                </div>
                
                {!(this.state.pokemons.length !== 150)
                    ? <p>Please wait, loading all pokemons......</p>
                    : <PokemonGallery pokemons={this.state.pokemons} filter={this.state.filter}/>
                }
                

            </div>
        )

    }
        
        
        
}

function applyFilter(filter){
    return function(x){
        if(filter.includes("all")){
            return true;
        }
        else {
            for(var i = 0; i < x.types.length; i++){
                if(filter.includes(x.types[i].type.name)){
                    return true;
                }
            }
            return false;
        }
        
    }
}

function PokemonGallery(props){
    return(
        <ul className = "galleryContainer">
            {props.pokemons.filter(applyFilter(props.filter)).map( function(pokemon, index) {
                    
                if(pokemon.sprites.front_default !== null && props.query !== "") {
                    var stats = pokemon.stats;
                    var sum = 0;
                    for(var i  = 0; i < stats.length; i++){
                        sum = sum + stats[i].base_stat;
                    }
                    return (
                        <div key = {pokemon.id} className = "galleryCard" onClick={()=>history.push("/detail/"+pokemon.id)}>
                            
                             <li className='popular-item-list'>
                                <Card className= 'pokemonView'>
                                    <Card.Content className= 'pokemonView'>
                                        
                                        <Card.Meta className='pokemonView'>
                                        Pokedex #{pokemon.id}
                                        </Card.Meta>
                                        <Card.Header className='pokemonView'>
                                        {pokemon.name}
                                        </Card.Header>
                                        <img
                                        src={pokemon.sprites.front_default}
                                        alt={`Sprite of ${pokemon.name}`}
                                        />
                                    </Card.Content> 
                                </Card>
							</li>
                        </div>

                    )
                } else{
                    return(
                        <p>No pokemon with this type(s)</p>
                    )
                }
            })}
        </ul>
    )
}


export default Gallery;
