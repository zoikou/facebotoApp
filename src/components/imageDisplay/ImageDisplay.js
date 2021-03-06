import React from 'react';
import './ImageDisplay.css';

// return the image submitted in the imageLinkForm with the face box
const ImageDisplay = ({imageUrl,box})=>{
	return (
		<div className='center ma'>
      <div className='absolute mt2'>
        <img id='inputimage' alt='' src={imageUrl} width='500px' heigh='auto'/>
        <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
      </div>       
		</div>
    );
}

export default ImageDisplay;