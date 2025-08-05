import { button } from '../components/Button.js';


const render = () => {
    const information = document.querySelector(`.information`);
    information.insertAdjacentHTML(`beforeend`, button({
        id: 'home',
        text: '돌아가기',
        size: 'large',
        disabled: false,
        href: '/was/',
    }));
}

render();