export async function doLogin(email, password) {
    if(email === 'contato@luiztools.com.br' 
    && password === '123456'){
        return true;
    }
    return false;
}

export async function doLogout(token) {
    
}