export async function doLogin(email, password) {
    return new Promise((resolve, reject) => {
        if(email === 'contato@luiztools.com.br' 
        && password === '123456'){
            return resolve(true);
        }
        return reject(`Invalid user and/or password!`);
    })
}

export async function doLogout(token) {
    
}