import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom';
import PrimaryRoutes from './pages/layouts/PrimaryRouter';
import './styles/index.less';

const App = () => {
    return (
        <BrowserRouter>
            <HashRouter>
                <Switch>
                    <Route path='/' component={PrimaryRoutes} />
                </Switch>
            </HashRouter>
        </BrowserRouter>
    );
};

export default App;