import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  //Cette fonction peut être déclarée outside of the scope parce que pas d'interaction avec quoique ce soit de défini dans le composant
  const emailReducer = (state, action) => {
    if (action.type === 'USER_INPUT') {
      return {value: action.val, isValid: action.val.includes('@')};
    }
    if (action.type === 'INPUT_BLUR') {
      return {value: state.value, isValid: state.value.includes('@')}; // on ne laisse pas value vide car l'input peut blur une fois que l'user a mis quelque chose
    }
    return {value: '', isValid: false};
  };

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value : '',
    isValid: null
  });

  const passwordReducer = (state,action) => {
    if (action.type === 'USER_INPUT') {
      return {value: action.val, isValid: action.val.trim().length > 6};
    }
    if (action.type === 'INPUT_BLUR') {
      return {value: state.value, isValid: state.value.trim().length > 6}; // on ne laisse pas value vide car l'input peut blur une fois que l'user a mis quelque chose
    }
    return {value: '', isValid: false};
  };

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value : '',
    isValid: null
  });

  //Assigner un alias -> object destructuring syntax => passer certaines propriétés plutôt que l'objet entier
  const {isValid: emailIsValid} = emailState;
  const {isValid: passwordIsValid} = passwordState;


  useEffect(() => {
    const identifier = setTimeout(()=>{
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);
    return () => {
      clearTimeout(identifier);
    }; // Clean up function
  }, [emailIsValid, passwordIsValid]); //utilisation de ces constantes cô ça si la valeur change mais pas la validité, cet effet ne rerun pas

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value});

    // setFormIsValid(
    //   event.target.value.includes('@') && passwordState.isValid
    // );
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT', val: event.target.value})

    // setFormIsValid(
    //   emailState.isValid && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR'}); // Pas obligé de mettre une val car on veut juste que l'input perde le focus
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR'})
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
