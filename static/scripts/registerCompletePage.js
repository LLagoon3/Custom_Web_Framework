import { button } from '../components/Button.js';
import { inputBox } from '../components/inputBox.js';

import { BASEURL, STATIC_URL } from './config.js';
import { getCookie } from './util.js';


const redner = () => {

    const navigation = document.querySelector(`.navigation`);

    navigation.insertAdjacentHTML(`beforeend`, button({
        id: 'loginOrRegister',
        text: '로그인/회원가입',
        size: 'small',
        disabled: false,
    }));
    

    const inputForm = document.querySelector(`#input-group`);
    inputForm.insertAdjacentHTML(`beforeend`, inputBox({
        id: 'email',
        name: 'email',
        label: '이메일',
        type: 'email',
        placeholder: getCookie('email'),
        disabled: true,
    }));

    inputForm.insertAdjacentHTML(`beforeend`, inputBox({
        id: 'nickname',
        name: 'nickname',
        label: '닉네임',
        type: 'text',
        placeholder: getCookie('nickname'),
        disabled: true,
    }));


    const submitGroup = document.querySelector(`#submit-group`);

    submitGroup.insertAdjacentHTML(`afterbegin`, button({
        id: 'login',
        text: '지금 로그인하기',
        size: 'large',
        disabled: false,
    }));
}

const handleEventListeners = async () => {
    document.addEventListener('click', async (e) => {
        if (e.target.id === 'loginOrRegister' || e.target.id === 'login') { 
            location.href = `/${STATIC_URL}/login`;
        }
    });
}

redner();
handleEventListeners();