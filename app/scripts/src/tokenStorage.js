export class TokenStore {
  constructor(storageApi) {
    this.api = storageApi;
  }
  getToken() {
    return this.api.getItem("token");
  }
  getExpirationDate() {
    return this.api.getItem("token_expiration_date");
  }
  set(token, expirationDate) {
    this.api.setItem("token", token);
    this.api.setItem("token_expiration_date", expirationDate);
  }
  removeToken() {
    this.api.removeItem("token");
    this.api.removeItem("token_expiration_date");
  }
}
