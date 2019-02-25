import React, { Component } from 'react';
import {Input, Radio, Grid, Image, Segment, Checkbox } from 'semantic-ui-react';
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
			sortby: sortWays[0].value,
			radio: 'ascending',
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
        var TOTAL_POKEMON_COUNT = 100;
        //getting all promises 
		var	promises = [];
		var array = new Array(TOTAL_POKEMON_COUNT); 
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
				<img className = "someImage" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png"></img>
				<div className = "container">
                	<Input placeholder='Seach pokemons by name or ID!' fluid value={this.state.query} onChange={this.queryHandler.bind(this)}/>
					<h4>Sort by: </h4>
					<Segment className = "Segment">
					
					<Checkbox label='Name'  value='name' onChange={this.sortHandler.bind(this)} checked={this.state.sortby==='name'}/> 
					<Checkbox label='Pokedex id'  value='id' onChange={this.sortHandler.bind(this)} checked={this.state.sortby==='id'}/> 
					<Checkbox label='Strength'  value='stats' onChange={this.sortHandler.bind(this)} checked={this.state.sortby==='stats'}/> 
					</Segment>
					<Radio label='Ascending' name='radioGroup' value='ascending' onChange={this.radioHandler.bind(this)} checked={this.state.radio==='ascending'}/> 
					<Radio label='Descending' name='radioGroup' value='descending'  onChange={this.radioHandler.bind(this)} checked={this.state.radio==='descending'}/>
					{!this.state.pokemons
						? <p>Please wait, loading all pokemons......</p>
						: <PokemonGridList pokemons={this.state.pokemons} query={this.state.query} sortby={this.state.sortby} radio={this.state.radio}/>
					}
				</div>
				</div>
            </div>
        )
	}
	
}


function searchingFor(search) {
	return function(x) {
		return x.name.toLowerCase().includes(search.toLowerCase()) ||
		x.id === parseInt(search) ||
		!search;
	}
}

function comparisonFunction(sortby, radio) {
	if(sortby == 'name') {
		if(radio == 'ascending') {
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
		if(radio == 'ascending') {
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
		if(radio == 'ascending') {
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
	
	return(
		<ul className='popular-list-list'>
			{props.pokemons.filter(searchingFor(props.query)).sort(comparisonFunction(props.sortby, props.radio)).map( function(pokemon, index) {
				
				if(pokemon.sprites.front_default !== null && props.query !== "") {
					var stats = pokemon.stats;
					var sum = 0;
					for(var i  = 0; i < stats.length; i++){
						sum = sum + stats[i].base_stat;
					}
					return (
						<div key = {pokemon.id} className = "card" onClick={()=>history.push("/detail/"+pokemon.id)}>
							<Grid>
								<Grid.Column width={4}>
									<li className='popular-item-list'>
										<Image className='picture-list' src={pokemon.sprites.front_default}/>
									</li>
								</Grid.Column>
								<Grid.Column width={12} >
									<h4 className='title'>{pokemon.name}</h4>
									<h4 className='rating'>{'Pokedex id: ' + pokemon.id}</h4>
									<h4 className='rating'>{'Strength: ' + sum}</h4>

								</Grid.Column>
							</Grid>
							</div>

					)
				}
			})}
		</ul>
	)
}
PokemonGridList.propTypes = {
	pokemons: PropTypes.array.isRequired,
}



const sortWays = [
	{ value: 'name', text: 'Name' },
	{ value: 'id', text: 'Pokedex id'},
	{ value: 'stats', text: 'Pokemon strength'},
]


Search.propTypes = {
	pokemons: PropTypes.arrayOf(PropTypes.object),
	search: PropTypes.string,
	sortby: PropTypes.string,
	radio: PropTypes.string,
}

export default Search;
