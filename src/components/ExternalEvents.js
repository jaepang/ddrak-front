/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const ExternalEvents = () => {
	return (
		<div id='externalEvents' css={style}>
			<h3>원하는 시간으로 드래그하세요</h3>
			<div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
		    	<div className='fc-event-main'>악의꽃</div>
	  		</div>
			<div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
		    	<div className='fc-event-main'>막무간애</div>
	  		</div>
			<div className='fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event'>
		    	<div className='fc-event-main'>모여락</div>
	  		</div>
		</div>
	)
}

const style = css `
	.fc-event {
		margin: 15px 5px;
	    height: 50px;
`;

export default ExternalEvents;
