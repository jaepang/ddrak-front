import React from 'react';

const DraggableEvent = ({ club, duration }) => {
	return (
		<div 
			id='draggable-el'
			dataEvent="{title: {club}, duration: {duration}}"
		>
		{ club }
		</div>
	)
}

export default DraggableEvent;
