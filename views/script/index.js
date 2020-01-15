window.onload = () => {
    const axiosInstance = axios.create({
        baseURL: `https://37.204.57.169:8080`,
        timeout: 2000,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    checkAuth();

    const formGenerateToken = document.getElementById('form-generate-token');
    const formLogIn = document.getElementById('form-log-in');
    const formUpload = document.getElementById('form-upload');
    const formDownload = document.getElementById('form-download');
    const formLogout = document.getElementById('form-log-out');
    formLogIn.addEventListener('submit', onLogIn);
    formGenerateToken.addEventListener('submit', onGenerateToken);
    formUpload.addEventListener('submit', onUpload);
    formDownload.addEventListener('submit', onDownload);
    formLogout.addEventListener('submit', onLogOut);

    function checkAuth() {
        return axiosInstance.post('user/checkAuth', {
            timeout: 1000,
        })
            .then(() => {
                document.getElementById('state-authorized').style.display = 'block';
                console.log('%cПользователь авторизован', 'color: green;');
            })
            .catch(() => {
                document.getElementById('state-unauthorized').style.display = 'block';
                console.log('%cПользователь не авторизован', 'color: red;');
            });
    }

    function onLogIn(event) {
        event.preventDefault();

        return axiosInstance.post('user/login2', {
            token: event.target.elements.token.value,
        })
            .then(response => {
                console.log(response);
                document.getElementById('state-authorized').style.display = 'block';
                document.getElementById('state-unauthorized').style.display = 'none';
            })
            .catch(error => {
                console.error(error);
                let errorText = 'Что-то пошло не так';
                switch (error.response.status) {
                    case 401:
                        document.getElementById('token_err').style.display = 'block';
                        break;
                }
            });
    }

    function onLogOut(event) {
        event.preventDefault();

        return axiosInstance.post('user/logout', {})
            .then(response => {
                console.log(response);
                document.getElementById('state-authorized').style.display = 'none';
                document.getElementById('state-unauthorized').style.display = 'block';
            })
            .catch(error => {
                console.error(error);
                let errorText = 'Что-то пошло не так';
                switch (error.response.status) {
                    case 401:
                        document.getElementById('token_err').style.display = 'block';
                        break;
                }
            });
    }

    function onGenerateToken(event) {
        event.preventDefault();

        return axiosInstance.post('user/login', {
            login: event.target.elements.login.value,
            password: event.target.elements.password.value,
        })
            .then(response => {
                document.getElementById('state_token-not-generated').style.display = 'flex';
                document.getElementById('state_token-generated').style.display = 'none';
                console.log(response);
            })
            .catch(error => {
                console.error(error);
                let errorText = 'Что-то пошло не так';
                switch (error.response.status) {
                    case 401:
                        document.getElementById('login_err').style.display = 'block';
                        break;
                }
            });
    }

    function onUpload(event) {
        event.preventDefault();

        const binaryFile = document.getElementById('input-upload').files[0];
        if (binaryFile) {
            calculateMd5(binaryFile);
        } else {
            alert('Не выбран файл');
        }

        function calculateMd5(blob) {
            const reader = new FileReader();
            reader.readAsBinaryString(blob);
            reader.onloadend = function () {
                const hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(reader.result)).toString();
                const formData = new FormData();
                formData.append('document', binaryFile);
                formData.append('hash', hash);

                return axiosInstance({
                    method: 'POST',
                    url: 'document/upload',
                    data: formData,
                })
                    .then(response => {
                        switch (response.data.message) {
                            case 'File hash was updated':
                                alert('MD5 хэш файла успешно обновлен');
                                break;

                            case 'File was successfully uploaded':
                                alert('Файл успешно загружен');
                                break;
                        }
                    })
                    .catch(error => {
                        console.error(error);

                        let errorText = 'Что-то пошло не так';
                        switch (error.response.status) {
                            case 400:
                                errorText = 'Укажите файл';
                                break;

                            case 401:
                                errorText = 'Вы не авторизованы, обновите страницу';
                                break;

                            case 406:
                                errorText = 'Неверный хэш файла';
                                break;
                        }

                        alert(errorText);
                    });
            }
        }
    }

    function onDownload(event) {
        event.preventDefault();

        /*const tmpElement = document.createElement('a');
        tmpElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        tmpElement.setAttribute('download', event.target.elements.filename.value);
        tmpElement.style.display = 'none';
        document.body.appendChild(tmpElement);
        tmpElement.click();
        document.body.removeChild(tmpElement);*/

        /*return downloadFile(`https://37.204.57.169:8080:document/download?fileName=${event.target.elements.filename.value}`)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                console.error(error);

                let errorText = 'Что-то пошло не так';
                switch (error.response.status) {
                    case 401:
                        errorText = 'Вы не авторизованы, обновите страницу';
                        break;
                }

                alert(errorText);
            });*/
    }
}
;
