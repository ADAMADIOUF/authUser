import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import HomeScreen from './screen/HomeScreen';
import { store } from './store';
import { Provider } from 'react-redux'
import LoginScreen from './screen/LoginScreen';

import RegisterScreen from './screen/RegisterScreen';
import ForgetPasswordScreen from './screen/ForgotPasswordScreen';
import VerifyEmailScreen from './screen/VerifyEmailScreen';
import ResetPasswordScreen from './screen/ResetPasswordScreen';
import PrivateRoute from './components/PrivateRoute';
import ProfileScreen from './screen/ProfileScreen';
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />

      <Route path='/forgot-password' element={<ForgetPasswordScreen />} />
      <Route path='/reset-password/:token' element={<ResetPasswordScreen />} />
      <Route path='/verify' element={<VerifyEmailScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
    </Route>
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
