import { Component } from 'react';
import { observer, inject } from 'mobx-react';
/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { ButtonIcon } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@inject('calendar')
@observer
class Header extends Component {
	render() {
		const { calendar } = this.props;
		const cur = calendar.curDateObj;
		return(
			<div css={style}>
				<h1>{cur.year}년 {cur.month}월</h1>
				<div>
					<ButtonIcon
						size="large" 
						icon={<FontAwesomeIcon icon={faChevronLeft} />} 
						onClick={calendar.moveLeft}
					/>
					<ButtonIcon
						size="large" 
						icon={<FontAwesomeIcon icon={faChevronRight} />} 
						onClick={calendar.moveRight}
					/>
				</div>
			</div>
		)
	}
}

const style = css `
	padding: 1.5rem;
	padding-bottom: 0;
	display: flex;
    justify-content: space-between;
	h1 {
		margin: 0;
	}
`;

export default Header;
