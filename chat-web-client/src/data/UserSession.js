export class UserSession{
    constructor(sessionkey){
        this.UserSessionKey = sessionkey;

    }
    getSession(){
        return this.UserSessionKey;
    }
    isValid(){
        return !(this.UserSessionKey == '' );
    }
}
