import React from 'react';

const SignOut = ({onRouteChange, isSignedIn})=>{
		if(isSignedIn){
			return(
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
		      <p onClick={()=> onRouteChange('signIn')}className='f3 link dim black underline pa3 pointer'> Sign Out </p>
		    </nav>
		    );
		}
		else{
			return(
			<nav style={{display: 'flex', justifyContent: 'flex-end'}}>
		      <p onClick={()=> onRouteChange('signIn')}className='f3 link dim black underline pa3 pointer'> Sign In</p>
		       <p onClick={()=> onRouteChange('signUp')}className='f3 link dim black underline pa3 pointer'> Sign Up</p>
		    </nav>
		    );
		}
}

export default SignOut;