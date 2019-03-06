import React, { Component } from 'react';
import { Card, Label, Button} from 'semantic-ui-react';
import axios from 'axios';
//import PropTypes from 'prop-types';
import history from '../history'
require('./Detail.scss');

class Detail extends Component{
    constructor() {
		super();
		this.state = {
            pokemons: [],
            pokemon: {},
            pokemonId: '',
            TOTAL_POKEMON_COUNT: 386
		};

        this.previousHandler = this.previousHandler.bind(this);
		this.nextHandler = this.nextHandler.bind(this);

    }

    //IMPORTANT:
    //Pokemon's index in Pokemons array = pokemon's ID - 1
    previousHandler(){
        var index = parseInt(this.state.pokemonId)
        if(index === 1){
            //return to Mew
            this.props.history.push("/detail/" + this.state.TOTAL_POKEMON_COUNT);
            this.setState({pokemonId: this.state.TOTAL_POKEMON_COUNT, pokemon: this.state.pokemons[this.state.TOTAL_POKEMON_COUNT - 1]});
        } else{
            this.props.history.push("/detail/" + (index - 1));
            this.setState({pokemonId: index - 1, pokemon: this.state.pokemons[index - 2]});
        }
    }

    nextHandler(){
        var index = parseInt(this.state.pokemonId)
        if(index === this.state.TOTAL_POKEMON_COUNT){
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
                    
	            <div className="pokedex">
                    
                <div className = "innerClass">
                        <img className = "someImage" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/2560px-International_Pok%C3%A9mon_logo.svg.png"onClick={()=>history.push("/")} 
                        alt = "Sprite"></img>
                </div>

                <Button className = "button-link" onClick={()=>history.push("/")}>Homepage</Button>
                <Button className = "button-link" onClick={()=>history.push("/gallery")}>Gallery</Button>

                <div className = 'detail-container'>
                    
                    <div className = 'detail-content'>
                    {!this.state.pokemon
                    ? <p>LOADING</p>
                    : <DetailView pokemon={this.state.pokemon} pokemonId={this.state.pokemonId}/>
                    }
                    </div>
                    
                    
                </div>
                    
					
					
                    <div className = "link">
                        <div className='previous-container'>
                            <Button className='previous' onClick={()=>this.previousHandler()}>Previous</Button>
                        </div>
                        <div className='next-container'>
                            <Button className='next' onClick={()=>this.nextHandler()}>Next</Button>
                        </div>
					</div>
	            </div>
			</div>
        )
            
    }
        

}


function DetailView(props){
    console.log(props.pokemon.name)
    if(props.pokemon.sprites != null){
        const abilitiesView = props.pokemon.abilities.map((ability, idx) => {
            return (
              <Label key={idx}>
                {ability.ability.name}
              </Label>
            )
          });
          const typesView = props.pokemon.types.map((type, idx) => {
            return (
              <Label key={idx}>
                {type.type.name}
              </Label>
            )
          });
          var RadarChart = require("react-chartjs").Radar;
          
          var data = {
            labels: ["Attack", "Defense", "Special-Attack", "Special-Defense", "HP", "Speed"],
            datasets: [
                {
                    label: props.pokemon.name,
                    fillColor: "rgba(255,0,0,0.5)",
                    strokeColor: "rgba(255,0,0,0.5)",
                    pointColor: "rgba(255,0,0,0.5)",
                    pointStrokeColor: "#ff0000",
                    pointHighlightFill: "#ff0000",
                    pointHighlightStroke: "rgba(255,0,0,0.5)",
                    data: [props.pokemon.stats[0].base_stat, 
                    props.pokemon.stats[1].base_stat,
                    props.pokemon.stats[2].base_stat,
                    props.pokemon.stats[3].base_stat,
                    props.pokemon.stats[4].base_stat,
                    props.pokemon.stats[5].base_stat]
                }
            ]
        };

        var options = {
            scaleOverride: true,
            scaleSteps: 5,
            scaleStepWidth: 30,
            scaleStartValue: 0
            };

        var stats = props.pokemon.stats;
        var sum = 0;
        for(var i  = 0; i < stats.length; i++){
            sum = sum + stats[i].base_stat;
        }
        return(
            <ul className='detail-wrap'>
                <div key={props.pokemon.id} className='detail-card'>
                    
                    <Card className= 'pokemonView-detail'>
                        <Card.Content>
                            <h4>Abilities: </h4>
                            {abilitiesView}
                            <h4>Types: </h4>
                            {typesView}
                        </Card.Content> 
                    </Card>


                    <Card className= 'pokemonView-detail'>
                        <Card.Content>
                            
                            <Card.Meta>
                            Pokedex #{props.pokemon.id}
                            </Card.Meta>
                            <Card.Header>
                            {props.pokemon.name}
                            </Card.Header>
                            <img
                            src={props.pokemon.sprites.front_default}
                            alt={`Sprite of ${props.pokemon.name}`}
                            />
                        </Card.Content> 
                    </Card>


                    <Card>
                        <Card.Content>
                            <RadarChart data={data} options={options} />
                            <h4>Total: </h4>
                            <p>{sum}</p>
                        </Card.Content> 
                    </Card>
                </div>            
            </ul>
        )    
    } else{
        return null;
    }
}
export default Detail;
