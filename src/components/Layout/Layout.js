import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, withRouter, Redirect } from 'react-router';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Hammer from 'rc-hammerjs';

import Dashboard from '../../pages/dashboard';
import Analysis from '../../pages/analysis/';
import Reviews from '../../pages/reviews';
import Charts from '../../pages/charts/';

import Header from '../Header';
import Sidebar from '../Sidebar';
import { openSidebar, closeSidebar } from '../../actions/navigation';
import logo from './gpbLogo.png';
import s from './Layout.module.scss';

class Layout extends React.Component {
	static propTypes = {
		sidebarStatic: PropTypes.bool,
		sidebarOpened: PropTypes.bool,
		dispatch: PropTypes.func.isRequired,
	};

	static defaultProps = {
		sidebarStatic: false,
		sidebarOpened: false,
	};
	constructor(props) {
		super(props);

		this.handleSwipe = this.handleSwipe.bind(this);
	}


	handleSwipe(e) {
		if ('ontouchstart' in window) {
			if (e.direction === 4 && !this.state.chatOpen) {
				this.props.dispatch(openSidebar());
				return;
			}

			if (e.direction === 2 && this.props.sidebarOpened) {
				this.props.dispatch(closeSidebar());
				return;
			}

			this.setState({ chatOpen: e.direction === 2 });
		}
	}

	render() {
		return (
			<div
				className={[
					s.root,
					'sidebar-' + this.props.sidebarPosition,
					'sidebar-' + this.props.sidebarVisibility,
				].join(' ')}
			>
				<div className={s.wrap}>
					<Header />
					{/* <Chat chatOpen={this.state.chatOpen} /> */}
					{/* <Helper /> */}
					<Sidebar />
					<Hammer onSwipe={this.handleSwipe}>
						<main className={s.content}>
							<TransitionGroup>
								<CSSTransition
									key={this.props.location.key}
									classNames="fade"
									timeout={200}
								>
									<Switch>
										<Route path="/app/main" exact render={() => <Redirect to="/app/main/dashboard" />} />
										<Route path="/app/main/dashboard" exact component={Dashboard} />
										<Route path="/app/analysis" exact component={Analysis} />
										<Route path="/app/reviews" exact component={Reviews} />
										<Route path="/app/charts" exact component={Charts} />
									</Switch>
								</CSSTransition>
							</TransitionGroup>
						</main>
					</Hammer>
				</div>
			</div>
		);
	}
}

function mapStateToProps(store) {
	return {
		sidebarOpened: store.navigation.sidebarOpened,
		sidebarPosition: store.navigation.sidebarPosition,
		sidebarVisibility: store.navigation.sidebarVisibility,
	};
}

export default withRouter(connect(mapStateToProps)(Layout));
