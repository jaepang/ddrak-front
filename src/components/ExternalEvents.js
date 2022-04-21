import React from 'react';
import { observer } from 'mobx-react';
import { useStore } from '../stores';
import styled from '@emotion/styled';

const ExternalEvents = observer(() => {
	const { page } = useStore();
	return (
		<React.Fragment>
			{!page.borrowTimeMode ? 
				(
					<Events>
						<h3>원하는 시간으로 드래그하세요</h3>
						<div className='fc-event lfdm fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ page.isSuper ? '악의꽃':'합주' }</div>
						</div>
						<div className='fc-event mmge fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ page.isSuper ? '막무간애':'합주 테스트' }</div>
						</div>
						<div className='fc-event myr fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ page.isSuper ? '모여락':'공연' }</div>
						</div>
					</Events>
				):(
					<Events>
						<h3>원하는 시간으로 드래그하세요</h3>
						<div className='fc-event lfdm fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ page.otherclubs[0] }</div>
						</div>
						<div className='fc-event mmge fc-h-event fc-daygrid-event fc-daygrid-block-event'>
							<div className='fc-event-main'>{ page.otherclubs[1] }</div>
						</div>
					</Events>
				)
			}
		</React.Fragment>
	);
});

const Events = styled.div`
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
