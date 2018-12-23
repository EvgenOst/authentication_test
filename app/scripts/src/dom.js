import $ from 'jquery';

export class AuthForm {
  constructor(formSel, emailSel, passSel, statusSel) {
    this.$form = $(formSel);
    this.$inputEmail = $(emailSel);
    this.$inputPass = $(passSel);
    this.$status = $(statusSel);
  }
  //Регистрация обработчика на отправку
  init(submitCallback) {
    this.$form.submit((e) => {
      e.preventDefault();
      let data = {
        email: this.$inputEmail.val(),
        password: this.$inputPass.val()
      };
      submitCallback(data);
    });
  }

  //Вывод статуса
  status(message) {
    this.$status.text(message);
  }

  //Спрятать форму
  hide() {
    this.$form.slideUp(400);
  }
  show() {
    this.$form.slideDown(400);
  }
}

export class ScreenApp {
  constructor(screenSel) {
    this.$screen = $(screenSel);
  }

  //Успешный вход в приложение
  signin(message) {
    this.$screen.prepend($('<span>', {
      text: message
    }));
    this.$screen.slideDown(400);
  }
  //Выход из приложения
  signout() {
    this.$screen.slideUp(400);
  }
}
