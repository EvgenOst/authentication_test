import socket from './ws-client';
import {
  AuthForm,
  ScreenApp
} from './dom';
import {
  TokenStore
} from './tokenStorage';
import uuid from 'uuid/v4';
import moment from 'moment';

const AUTH_FORM_SEL = '[data-app="auth-form"]';
const INPUT_EMAIL_SEL = '[data-app="email-input"]';
const INPUT_PASS_SEL = '[data-app="pass-input"]';
const STATUS_SEL = '[data-app="status"]';
const SCREEN_SEL = '[data-app="screen-app"]';

class TestApp {
  constructor() {
    let tokenStorage = new TokenStore(localStorage);
    let authForm = new AuthForm(AUTH_FORM_SEL, INPUT_EMAIL_SEL, INPUT_PASS_SEL, STATUS_SEL);
    let screenApp = new ScreenApp(SCREEN_SEL);

    socket.init('ws://localhost:8080');

    let token = tokenStorage.getToken()
    let expDate = tokenStorage.getExpirationDate();
    //Если токен существует и не просрочен то аунтефикация происходит автоматически
    if (expDate &&
      (moment(expDate).valueOf() - moment().valueOf()) > 0) {
      console.log(token, expDate);
      authForm.hide();
      screenApp.signin('Already sign in! api_token_expiration_date: ' + expDate);

      //Автоматический выход и сброс токена при истечении его срока
      setTimeout(() => {
        tokenStorage.removeToken();
        screenApp.signout();
        authForm.show();
      }, moment(expDate).valueOf() - moment().valueOf());

    }

    //Регистрация обработчиков для websocket
    socket.registerOpenHandler(() => {
      authForm.init((data) => {
        let message = {
          type: "LOGIN_CUSTOMER",
          sequence_id: token || uuid(),
          data: data
        };
        socket.sendMessage(message);
      });
    });

    socket.registerMessageHandler((data) => {
      if (data.type == "CUSTOMER_API_TOKEN") {
        authForm.hide();
        let token = data.data.api_token;
        let token_expiration_date = data.data.api_token_expiration_date;
        tokenStorage.set(token, token_expiration_date);

        screenApp.signin('Успешный вход! api_token_expiration_date: ' + token_expiration_date);
      } else if (data.type == "CUSTOMER_ERROR") {
        console.log(data);
        authForm.status(data.data.error_description);
      }
    });

    socket.registerCloseHandler(() => {
      alert("Соединение WebSocket закрыто!");
    });

  }
}

export default TestApp;
