/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { inject, observer } from 'mobx-react';
import React from 'react';

const ExternalEvents = ({isSuper, club, borrow=false}) => {
	const clubs = ['악의꽃', '막무간애', '모여락'];
	const target = clubs.filter(c => c !== club);
	return (
		<React.Fragment>
			{!borrow ? 
				(
					<div id='externalEvents' css={style}>
						<h3>원하는 시간으로 드래그하세요</h3>
						<div className='fc-event lfdm fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ isSuper ? '악의꽃':'합주' }</div>
						</div>
						<div className='fc-event mmge fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ isSuper ? '막무간애':'합주 테스트' }</div>
						</div>
						<div className='fc-event myr fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ isSuper ? '모여락':'공연' }</div>
						</div>
					</div>
				):(
					<div id='externalEvents' css={style}>
						<h3>원하는 시간으로 드래그하세요</h3>
						<div className='fc-event lfdm fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ target[0] }</div>
						</div>
						<div className='fc-event mmge fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ target[1] }</div>
						</div>
					</div>
				)
			}
		</React.Fragment>
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

export default inject(({ page }) => ({
	isSuper: page.isSuper,
	club: page.userclub,
	borrow: page.borrowTimeMode,
}))(observer(ExternalEvents));
