import * as React from 'react';
import { ReactNode, useState } from 'react';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import {FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import authorisationService from '../services/authorization.tsx';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { useAuth } from '../contexts/AuthContext.tsx';

/**
 * Form state.
 */
interface State {
  username: string;
  password: string;
}

/**
 * Component with sign in logic.
 * @returns {ReactNode}
 */
export default function SignInForm(): ReactNode {
  const [authData, setAuthData] = useState<State>({
    username: '',
    password: ''
  });
  const {setToken, setUuid} = useAuth();
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate =  useNavigate();
  const handleChange =
  (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthData({ ...authData, [prop]: event.target.value });
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameError(false);
    setPasswordError(false);
    let hasError : boolean = false;
    if(authData.username == ''){
      setUsernameError(true);
      hasError= true;
    }
    if(authData.password == '' ){
      setPasswordError(true);
      hasError= true;
    }
    setAuthData({
        username: '',
        password: '',
      });
    setShowPassword(false);
    if(!hasError){
      authorisationService.signIn(authData.username, authData.password)
      .then(res => {
        navigate("/")
        Cookies.set('token',  res.token)
        Cookies.set('uuid',  res.uuid)
        setToken(res.token)
        setUuid(res.uuid)
      })
      .catch(err => { console.log(err)})
    }
}

  return (
    <Box component="form" onSubmit={handleSignIn} id="authForm"
         sx={{ display: 'flex',
               flexDirection: 'column',
               flexWrap: 'wrap',
               boxShadow: 1,
               borderRadius: 2,
               maxWidth: '300px',
               p: 2,}}>
        <FormControl sx={{ m: 1}} variant="filled">
            <InputLabel htmlFor="authFormUsername">Username</InputLabel>
            <OutlinedInput 
              id="authFormUsername"
              type='text'
              value={authData.username}
              onChange={handleChange('username')}
              error={usernameError}
            />
        </FormControl>
        <FormControl sx={{ m: 1}} variant="filled">
          <InputLabel htmlFor="authFormPassword">Password</InputLabel>
          <OutlinedInput 
            id="authFormPassword"
            type={showPassword ? 'text' : 'password'}
            value={authData.password}
            onChange={handleChange('password')}
            error={passwordError}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          </FormControl>
          <Button sx={{ m: 1}} variant="contained" type="submit" id="authFormSubmit">Sign in</Button>
    </Box>
  );
}
