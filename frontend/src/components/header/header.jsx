import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import images from '../../images';
import './header.css';
import LoadingBar from 'react-redux-loading-bar'
import { NavLink as RouteLink, Redirect } from 'react-router-dom';
import { Navbar, NavbarToggler, NavbarBrand, NavItem, Nav, Collapse, NavLink } from 'reactstrap';
import Icon from '../icon/icon';

class header extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			isLogout: false
		};
		this.toggle = this.toggle.bind(this);
		this.logout = this.logout.bind(this);
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	logout() {
		if (window.sessionStorage.getItem('token')) {
			window.sessionStorage.removeItem('token');
			window.sessionStorage.removeItem('auth');
			window.sessionStorage.removeItem('username');
			window.sessionStorage.removeItem('org');
			this.setState({
				isLogout: true
			});
		}
	}
	componentDidMount() {
		if (this.state.isLogout) {
			return <Redirect to="/" />;
		}
	}
	render() {
		const { match } = this.props;
		const current_user = window.sessionStorage.getItem('username');
		var c_user = null;
		switch (current_user) {
			case 'BoeingIN':
				c_user = 'Boeing India';
				break;
			case 'BoeingUS':
				c_user = 'Boeing USA';
				break;
			case 'BoeingUK':
				c_user = 'Boeing UK';
				break;
			default:
				c_user = null;
				break;
		}
		return (
			<header className={'header position-relative'}> 
				<div style={{'position': 'fixed', 'top': '54px', 'width':'100%', left: 0, zIndex: 2}}>
					<LoadingBar style={{ height: '2px' }} className="toploading_bar loader-bg"/>
				</div>
				<Navbar color="dark" dark fixed="top" expand="md">
					<NavbarBrand href="/">
						<b>Boeing Dashboard</b>
					</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="mr-auto" navbar>
							<NavItem className="d-sm-none ">
								<div className="navbar-text ml-auto user-info text-white h5 mb-2 mt-2">
									<img src={images.defaultUser} alt="" />
									Welcome {c_user}
								</div>
							</NavItem>
							<NavItem>
								<RouteLink activeClassName="active" className={'nav-link'} to={`${match.url}/employee`}>
									Employee
								</RouteLink>
							</NavItem>
							<NavItem>
								<RouteLink activeClassName="active" className={'nav-link'} to={`${match.url}/history`}>
									History
								</RouteLink>
							</NavItem>
							<NavItem>
								<NavLink className={'nav-link'} href="http://192.168.97.246:8080/" target="_blank">
									Block Explorer
								</NavLink>
							</NavItem>
							<NavItem className="d-sm-none">
								<NavLink className={'nav-link'} href="/" onClick={this.logout}>
									Logout
								</NavLink>
							</NavItem>
						</Nav>
					</Collapse>
					<div className="navbar-text ml-auto user-info d-none d-sm-block">
						<img src={images.defaultUser} alt="" />
						Welcome {c_user}
					</div>
					<Nav navbar className="d-none d-sm-block">
						<NavItem>
							<NavLink className={'nav-link'} href="/" onClick={this.logout}>
								<Icon icn="logout" />
								<span className="ml-1">Logout</span>
							</NavLink>
						</NavItem>
					</Nav>
				</Navbar>
			</header>
		);
	}
}

header.propTypes = {
	match: PropTypes.object
};

export default header;
