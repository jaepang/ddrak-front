/** @jsx jsx */
import { jsx, css } from '@emotion/core';

const ExternalEvents = () => {
	return (
		<div id='externalEvents' css={style}>
			<h3>원하는 시간으로 드래그하세요</h3>
			<div className='fc-event lfdm fc-h-event fc-daygrid-event fc-daygrid-block-event'>
		    	<div className='fc-event-main'>악의꽃</div>
	  		</div>
			<div className='fc-event mmge fc-h-event fc-daygrid-event fc-daygrid-block-event'>
		    	<div className='fc-event-main'>막무간애</div>
	  		</div>
			<div className='fc-event myr fc-h-event fc-daygrid-event fc-daygrid-block-event'>
		    	<div className='fc-event-main'>모여락</div>
	  		</div>
		</div>
	)
}

const style = css `
	.fc-event {
		display: flex;
		margin: 15px 5px;
	    height: 40px;
		border-radius: 15px;
		cursor: pointer;
		border: none;
	}
	.fc-event-main {
		margin-top: auto;
		margin-bottom: auto;
		margin-left: 10px;
	}
	.lfdm {
		background-color: #79A3F4;
	}
	.mmge {
		background-color: #FF6B76;
	}
	.myr {
		background-color: #CD9CF4;
	}
`;

export default ExternalEvents;
