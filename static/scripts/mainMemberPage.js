import { button } from '../components/Button.js';
import { inputBox } from '../components/inputBox.js';
import { memberPageNavRightGroup } from '../components/navRightGroup.js';
import { memberPageFooterRightGroup } from '../components/footerRightGroup.js';

import { BASEURL, STATIC_URL } from './config.js';

const render = () => {

    const navigationRightGroup = document.querySelector(`#navigation-right-group`);

    navigationRightGroup.insertAdjacentHTML(`afterbegin`, memberPageNavRightGroup());    


    const myPageForm = document.querySelector(`#mypage-form`);

    myPageForm.insertAdjacentHTML(`beforeend`, button({
        id: 'myPage',
        text: '마이페이지',
        size: 'small',
        disabled: false,
    }));

    
    const logoutForm = document.querySelector(`#logout-form`);

    logoutForm.insertAdjacentHTML(`beforeend`, button({
        id: 'loginOrRegister',
        text: '로그아웃',
        size: 'small',
        disabled: false,
    }));


    const footerRightGroup = document.querySelector(`#footer-right-group`);

    footerRightGroup.insertAdjacentHTML(`beforeend`, memberPageFooterRightGroup());

    footerRightGroup.insertAdjacentHTML(`beforeend`, button({
        id: 'write',
        text: '글쓰기',
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

export const mainMemberPage = () => {
    render();
    handleEventListeners();
}