import React, { Component } from 'react'; // import react component
import Particles from 'react-particles-js'; // import react particles
import Sound from 'react-sound'; //import react sound
 //import all necessary manual components
import NavigationBar from './components/navigationBar/NavigationBar';
import SignIn from './components/signIn/SignIn'; 
import SignUp from './components/signUp/SignUp';
import ImageDisplay from './components/imageDisplay/ImageDisplay';
import Logo from './components/logo/Logo';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import SoundButton from './components/soundButton/SoundButton';
import './App.css';
import sound from './ambientLoop.mp3';



// Author : Vincent Garreau  - vincentgarreau.com
// MIT license: http://opensource.org/licenses/MIT
// Code used from  https://github.com/VincentGarreau/particles.js/blob/master/particles.js
const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  },
  interactivity:{
   detect_on: "canvas",
   events:{
    onhover:{
    enable: true,
    mode: "repulse"
    }
   }
  }
}
// the default state of the app
const defaultState = {
      input:'', //parameter to keep track of the input in the APP, starting from an empty state
      imageUrl:'', //parameter to keep the image URL to display it, starting from an empty state
      box: {}, // an object to keep the coordinates of the face in the image, starting from an empty state
      route: 'signIn', //the App should start from the signIn page
      isSignedIn: false, 
      playing: true, //parameter to check if the sound is playing
      playstatus:Sound.status.PLAYING, //parameter to define the status for the Sound component
      //parameter to hold the user and its attributes
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor (){
    super();
    this.state= defaultState;
  }
// load the specific user
 loadUser = (data)=>{
   this.setState({user: {
       id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
   }})
 }
  //change the input state
  changeInputState = (event)=>{
     this.setState({input: event.target.value});
  }
  
  // returns the location of the face inside the image
  returnFaceLocation = (data) => {
    //code adopted by https://www.clarifai.com/developer/guide/
     const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
     const image = document.getElementById('inputimage');
     const width = Number(image.width);
     const height = Number(image.height);
     return{ 
       leftCol: clarifaiFace.left_col * width,
       topRow: clarifaiFace.top_row * height,
       rightCol: width - (clarifaiFace.right_col * width),
       bottomRow: height - (clarifaiFace.bottom_row * height)
     }
  }
  
  // Updates the state of the box parameter  
  displayFaceBox = (box) =>{
      console.log(box);
      this.setState({box: box})
  }
  
  // Communication with the clarifai API on picture submit detection
  onPictureSubmit = () =>{
    //set the state of the input
    this.setState({imageUrl:this.state.input});
    //invoke a server call to connect with the clarifaiAPI
    //code adapted from https://facebook.github.io/react-native/docs/network.html
    fetch('https://fathomless-journey-21104.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            input: this.state.input
        })
     }) 
    .then(response => response.json())   
    .then(response => {
      //if there is a response invoke another call to the server to update the user entries
      if(response){
        fetch('https://fathomless-journey-21104.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
        })
      })
        .then(response => response.json())
        .then(rank => {
          //update the entries state
          this.setState(Object.assign(this.state.user, { entries: rank}))
        })
        .catch(console.log)
    }
    // if everything is ok then display where is the face on the image
    this.displayFaceBox(this.returnFaceLocation(response))
  })
    //catch any error 
    .catch(err => console.log(err))
}
 // handle the display between diferrent routes and update the route parameter
  onRouteChange = (route)=>{
    if(route ==='signIn'){
      this.setState (defaultState);
    }else if(route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route });
  }
  // handle the the toggling of the sound 
  handleSong = (playing)=>{
    playing = !playing
    this.setState({playing: playing});
    if(playing === true){
      this.setState({playstatus: Sound.status.PLAYING})
    }else{
      this.setState({playstatus: Sound.status.PAUSED})
    }
  }
  // render the app
  render() {
    return (
      <div className="App">
       <Particles className='particles'
              params={particleOptions}
        />
        <Sound
          //url="http://100p100musique.free.fr/loops-synthe-wav/120%20space%20ping%20pong.wav"
          url = {sound}
          playStatus={this.state.playstatus}
          autoLoad= {true}
          autoPlay= {true}
          loop= {true}
          volume= {40}
        />
        <NavigationBar isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home'
        //Check which route to display 
           ?<div>
               <Logo/>
               <SoundButton handleSong={this.handleSong} playing={this.state.playing}/>
               <Rank name={this.state.user.name} entries={this.state.user.entries}/>
               <ImageLinkForm 
                  changeInputState={this.changeInputState} 
                  onPictureSubmit={this.onPictureSubmit}/>
               <ImageDisplay box={this.state.box} imageUrl={this.state.imageUrl}/>
            </div>
           :( this.state.route === 'signIn'
            ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :<SignUp loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )      
        }
         
      </div>
    );
  }
}

export default App;
