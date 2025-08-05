import { button } from '../components/Button.js';
import { inputBox } from '../components/inputBox.js';

import { BASEURL, STATIC_URL } from './config.js';


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
        placeholder: '이메일을 입력해주세요',
    }));

    inputForm.insertAdjacentHTML(`beforeend`, inputBox({
        id: 'nickname',
        name: 'nickname',
        label: '닉네임',
        type: 'text',
        placeholder: '닉네임을 입력해주세요',
    }));

    inputForm.insertAdjacentHTML(`beforeend`, inputBox({
        id: 'password',
        name: 'password',
        label: '비밀번호',
        type: 'password',
        placeholder: '비밀번호를 입력해주세요',
    }));


    const submitGroup = document.querySelector(`#submit-group`);

    submitGroup.insertAdjacentHTML(`afterbegin`, button({
        text: '회원가입',
        size: 'large',
        disabled: false,
    }));
}

const handleEventListeners = async () => {
    document.addEventListener('click', async (e) => {
        if (e.target.id === 'loginOrRegister') {
            location.href = `/${STATIC_URL}/login`;
        }
    });
}

redner();
handleEventListeners();