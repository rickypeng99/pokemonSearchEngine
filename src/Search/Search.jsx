import React, { Component } from 'react';
import {Input, Radio,Card, Segment, Checkbox, Button } from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';
import history from '../history.jsx'

require('./Search.scss');


class Search extends Component {
	constructor() {
		super();
		this.state = {
			pokemons: [],
			query: '',
			sortby: 'name',
			radio: 'ascending',
			TOTAL_POKEMON_COUNT: 386
		};

		this.queryandler = this.queryHandler.bind(this);
		this.sortHandler = this.sortHandler.bind(this);
		this.radioHandler = this.radioHandler.bind(this);

	}
	queryHandler(event) {
		this.setState({query: event.target.value});
	}
	sortHandler(event, data) {
		this.setState({sortby: data.value});
	}
	radioHandler(event, data) {
		this.setState({radio: data.value});
	}

	componentDidMount() {
        //console.log('I was triggered during componentDidMount')
        //getting all promises 
		var	promises = [];
		var array = new Array(this.state.TOTAL_POKEMON_COUNT); 
		for(var i = 0; i < array.length; i++){
			array[i] = i+1;
		}
        array.forEach(function(singleElement){
			var myUrl = ("https://pokeapi.co/api/v2/pokemon/" + singleElement);
			promises.push(axios
				.get(myUrl)
				.catch((error) =>{
					return axios.get(("https://pokeapi.co/api/v2/pokemon/" + singleElement))
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
    render() {
	

		
        return(

            <div className="List">
				<div className = "pokedex"> 
					<div className = "settingContainer">

					

					<div className = "container-setting">
						
						<h4>Sort by: </h4>
						<Segment className = "Segment">
					
							<Checkbox label='Name'  value='name' onChange={this.sortHandler.bind(this)} checked={this.state.sortby==='name'}/> 
							<Checkbox label='Id'  value='id' onChange={this.sortHandler.bind(this)} checked={this.state.sortby==='id'}/> 
							<Checkbox label='Strength'  value='stats' onChange={this.sortHandler.bind(this)} checked={this.state.sortby==='stats'}/> 
						</Segment>
							
							
						<h4>Order: </h4>
							<Segment className = 'Segment'>
								<Radio label='Ascending' name='radioGroup' value='ascending' onChange={this.radioHandler.bind(this)} checked={this.state.radio==='ascending'}/> 
								<Radio label='Descending' name='radioGroup' value='descending'  onChange={this.radioHandler.bind(this)} checked={this.state.radio==='descending'}/>
							</Segment>
					</div>
					</div>

					<img className = "someImage" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png"onClick={()=>history.push("/")} 
                        alt = "Sprite"></img>


					<br></br>
					<Button className = "button-link" onClick={()=>history.push("/gallery")}>Gallery</Button>

						<div className = "searchBar">
							<Input placeholder='Seach pokemons by name or ID! (or type ? to retreive all pokemons)' fluid value={this.state.query} onChange={this.queryHandler.bind(this)}/>
						</div>

						
						
					
					
					{!this.state.pokemons
							? <p>Please wait, loading all pokemons......</p>
							: <PokemonGridList pokemons={this.state.pokemons} query={this.state.query} sortby={this.state.sortby} radio={this.state.radio}/>
					}
							
							
				</div>
            </div>
        )
	}
	
}


function searchingFor(search) {
	return function(x) {
		if(search === "?"){
			return true;
		} else{
			return x.name.toLowerCase().includes(search.toLowerCase()) ||
			x.id === parseInt(search)
		}
		
	}
}

function comparisonFunction(sortby, radio) {
	if(sortby === 'name') {
		if(radio === 'ascending') {
			return function(a, b) {
				if(a.name.toLowerCase() < b.name.toLowerCase())
					return -1;
				if(a.name.toLowerCase() > b.name.toLowerCase())
					return 1;
				return 0;
			}
		}
		else {
			return function(a, b) {
				if(b.name.toLowerCase() < a.name.toLowerCase())
					return -1;
				if(b.name.toLowerCase() > a.name.toLowerCase())
					return 1;
				return 0;
			}
		}
	}
	else if(sortby === 'id'){
		if(radio === 'ascending') {
			return function(a, b) {
				return a.id - b.id;
			}
		}
		else  {
			return function(a, b) {
				return b.id - a.id;
			}
		}
	}
	else if(sortby === 'stats'){
		if(radio === 'ascending') {
			return function(a, b) {
				var aStats = a.stats;
				var bStats = b.stats;
				var aStrength = 0, bStrength = 0;
				for(var i = 0; i < aStats.length; i++){
					aStrength = aStrength + aStats[i].base_stat;
					bStrength = bStrength + bStats[i].base_stat;

				}

				return aStrength - bStrength;
			}
		}
		else  {
			return function(a, b) {
				var aStats = a.stats;
				var bStats = b.stats;

				var aStrength =0, bStrength = 0;
				for(var i = 0; i < aStats.length; i++){
					aStrength = aStrength + aStats[i].base_stat;
					bStrength = bStrength + bStats[i].base_stat;


				}
				return bStrength - aStrength;
			}
		}
	}
}


function PokemonGridList(props) {
	if(props.query === ""){
		return(
			<div className = "warning">
				
				<p>Please input a query</p>
				
			</div>
		)
	} else if(props.pokemons.filter(searchingFor(props.query)).length === 0){
		return(
			<div className = "warning">
				
				<p>No pokemon is returned from this query</p>
				
			</div>
			
		)
	} 
	else{
		return(
			<ul className='galleryContainer'>
				{props.pokemons.filter(searchingFor(props.query)).sort(comparisonFunction(props.sortby, props.radio)).map( function(pokemon, index) {
					
					if(pokemon.sprites.front_default !== null && props.query !== "") {
						var stats = pokemon.stats;
						var sum = 0;
						for(var i  = 0; i < stats.length; i++){
							sum = sum + stats[i].base_stat;
						}
						return (
							<div key = {pokemon.id} className = "galleryCard" onClick={()=>history.push("/detail/"+pokemon.id)}>
								<Card className= 'pokemonView'>
                                    <Card.Content className= 'pokemonView'>
                                        
                                        <Card.Meta>
                                        Pokedex #{pokemon.id}
                                        </Card.Meta>
                                        <Card.Header className='pokemonView'>
                                        {pokemon.name}
                                        </Card.Header>
                                        <img
                                        src={pokemon.sprites.front_default}
                                        alt={`Sprite of ${pokemon.name}`}
                                        />
										<h4>Strength: </h4>
										<p>{sum}</p>
                                    </Card.Content> 
                                </Card>
								</div>
	
						)
					} else{
						return(
							<p>No pokemons with this type(s)</p>
						)
					}
				})}
			</ul>
		)
	}
	
}
PokemonGridList.propTypes = {
	pokemons: PropTypes.array.isRequired,
}



Search.propTypes = {
	pokemons: PropTypes.arrayOf(PropTypes.object),
	search: PropTypes.string,
	sortby: PropTypes.string,
	radio: PropTypes.string,
}

export default Search;
