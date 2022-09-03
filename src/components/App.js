import React from 'react';
import {connect} from 'react-redux';
import {Switch, Route, Redirect} from 'react-router';
import {HashRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import {createTheme, NextUIProvider} from "@nextui-org/react"

/* eslint-disable */
import ErrorPage from '../pages/error';
/* eslint-enable */

import '../styles/theme.scss';
import LayoutComponent from '../components/Layout';

const darkTheme = createTheme({
    type: 'dark',
})
const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close"/>

class App extends React.PureComponent {
    render() {
        return (
            <NextUIProvider theme={darkTheme}>
                <div>
                    <ToastContainer
                        autoClose={5000}
                        hideProgressBar
                        closeButton={<CloseButton/>}
                    />
                    <HashRouter>
                        <Switch>
                            <Route path="/" exact render={() => <Redirect to="/app/main"/>}/>
                            <Route path="/app" exact render={() => <Redirect to="/app/main"/>}/>
                            <Route path="/app" dispatch={this.props.dispatch} component={LayoutComponent}/>
                            <Route component={ErrorPage}/>
                            <Redirect from="*" to="/app/main/dashboard"/>
                        </Switch>
                    </HashRouter>
                </div>
            </NextUIProvider>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
