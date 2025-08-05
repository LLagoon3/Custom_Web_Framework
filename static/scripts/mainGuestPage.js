import { button } from '../components/Button.js';
import { inputBox } from '../components/inputBox.js';

import { BASEURL, STATIC_URL } from './config.js';

const render = () => {

    const navigationButtonGroup = document.querySelector(`#navigation-right-group`);

    navigationButtonGroup.insertAdjacentHTML(`beforeend`, button({
        id: 'loginOrRegister',
        text: '로그인/회원가입',
        size: 'small',
        disabled: false,
    }));
}

const handleEventListeners = async () => {

    document.addEventListener('click', async (e) => {
        if (e.target.id === 'myPage') {
            location.href = `/${STATIC_URL}/myPage`;
        }
        else if (e.target.id === 'loginOrRegister') {
            location.href = `/${STATIC_URL}/login`;
        }
    });
}

export const mainGuestPage = () => {
    render();
    handleEventListeners();
}