import React from 'react';
import './App.scss';
import Register from './pages/Register';
import { Container } from 'react-bootstrap';
import ApolloProvider from './ApolloProvider';
import { BrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/home/Home';
import { AuthProvider } from './context/auth';
import { MessageProvider } from './context/message';
import DynamicRoute from './util/DynamicRoute';
function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <Container className="pt-5">
              <DynamicRoute exact path="/" component={Home} authenticated />
              <DynamicRoute path="/register" component={Register} guest />
              <DynamicRoute path="/login" component={Login} guest />
            </Container>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
