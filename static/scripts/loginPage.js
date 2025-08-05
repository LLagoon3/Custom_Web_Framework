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


    const inputGroup = document.querySelector(`#input-group`);

    inputGroup.insertAdjacentHTML(`beforeend`, inputBox({
        id: 'email',
        name: 'email',
        label: '이메일',
        type: 'email',
        placeholder: '이메일을 입력해주세요',
        value: getCookie('email') || '',
    }));

    inputGroup.insertAdjacentHTML(`beforeend`, inputBox({
        id: 'password',
        name: 'password',
        label: '비밀번호',
        type: 'password',
        placeholder: '비밀번호를 입력해주세요',
    }));


    const submitGroup = document.querySelector(`#submit-group`);

    submitGroup.insertAdjacentHTML(`afterbegin`, button({
        id: 'oauth-google',
        text: '구글 로그인',
        size: 'large',
        disabled: false,
        href: `${BASEURL}/user/oauth`,
        type: 'button',
    }));

    submitGroup.insertAdjacentHTML(`afterbegin`, button({
        id: 'submit',
        text: '로그인',
        size: 'large',
        disabled: false,
    }));

    const body = document.querySelector(`body`);
    
}

const handleEventListeners = async () => {
    document.addEventListener('click', async (e) => {
        if (e.target.id === 'loginOrRegister') {
            location.href = `/${STATIC_URL}/register`;
        }
    });
}

redner();
handleEventListeners();