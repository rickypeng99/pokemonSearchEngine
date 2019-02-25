import React, { Component } from 'react';
import { Card, Input, Dropdown, Radio, Label, Grid, Image, Button, Segment, Checkbox } from 'semantic-ui-react';
import axios from 'axios';
import PropTypes from 'prop-types';

require('./Detail.scss');

class Detail extends Component{
    constructor() {
		super();
		this.state = {
            pokemons: [],
            pokemon: {},
            pokemonId: '',
		};

        this.previousClickHandler = this.previousClickHandler.bind(this);
		this.nextClickHandler = this.nextClickHandler.bind(this);

    }

    //IMPORTANT:
    //Pokemon's index in Pokemons array = pokemon's ID - 1
    previousClickHandler(){
        var index = parseInt(this.state.pokemonId)
        if(index == 1){
            //return to bulbasuar
            this.props.history.push("/detail/" + 100);
            this.setState({pokemonId: 100, pokemon: this.state.pokemons[99]});
        } else{
            this.props.history.push("/detail/" + (index - 1));
            this.setState({pokemonId: index - 1, pokemon: this.state.pokemons[index - 2]});
        }
    }

    nextClickHandler(){
        var index = parseInt(this.state.pokemonId)
        if(index == 100){
            //return to bulbasuar
            this.props.history.push("/detail/" + 1);
            this.setState({pokemonId: 1, pokemon: this.state.pokemons[0]});
        } else{
            this.props.history.push("/detail/" + (index+ 1));
            this.setState({pokemonId: index + 1, pokemon: this.state.pokemons[index]});
        }
        
    }

    componentDidMount(){
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
            this.setState({pokemon: pokemons[this.props.match.params.id - 1]})
            this.setState({pokemons: pokemons})
            this.setState({pokemonId: this.props.match.params.id})


		})
		.catch((error) => {
			console.log(error);
		});
    }
    render(){
        return(
            <div className="Detail-wrapper">

	            <div className="Detail">
                    <div className = "innerClass">
                        <img className = "someImage" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png"></img>
                    </div>

					<div className='button-container'>
                        <div className='previous-container'>
                            <Button className='previous' onClick={()=>this.previousClickHandler()}>Previous</Button>
                        </div>
                        <div className='next-container'>
                            <Button className='next' onClick={()=>this.nextClickHandler()}>Next</Button>
                        </div>
					</div>
					{!this.state.pokemon
						? <p>LOADING</p>
						: <DetailView pokemon={this.state.pokemon} pokemonId={this.state.pokemonId}/>
                    }
                    <div className = "link">
						<a href = "/">Back to homepage </a>
					</div>
	            </div>
			</div>
        )
            
    }
        

}


function DetailView(props){
    console.log(props.pokemon.name)
    if(props.pokemon.sprites != null){
        return(
            <ul className='detail-wrap'>
                <div key={props.pokemon.id} className='detail-card'>
                    <Grid>
                        <Grid.Column width={4}>
                            <h3 className='detail-title'>{props.pokemon.name}</h3>
                            <img className='detail-picture' src={props.pokemon.sprites.front_default}/>
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {/* <p className='detail-description'>{pokemon.overview}</p> */}
                            {/* <p className='detail-text'>{"First Air Date: " + }</p> */}
                            <p className='detail-text'>{"Id: "+ props.pokemon.id}</p>
                        </Grid.Column>
                    </Grid>
                </div>
    
                        
            </ul>
        )    
    } else{
        return null;
    }
}
export default Detail;
