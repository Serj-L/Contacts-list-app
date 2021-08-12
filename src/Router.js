import { Switch, Route } from 'react-router-dom';

import { ContactsListScreen, ContactInfoScreen } from './screens';

export const RouterView = () => {
  return (
    <Switch>
      <Route
        exact
        path='/'
        component={ContactsListScreen}
      />

      <Route
        path='/info'
        component={ContactInfoScreen}
      />

      <Route path='*'>
        <div>404 Not Found</div>
      </Route>
    </Switch>
  );
};
