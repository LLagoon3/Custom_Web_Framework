import { BASEURL, POST_PER_PAGE, STATIC_URL } from './config.js';
import { memberPageNavRightGroup } from '../components/navRightGroup.js';
import { button } from '../components/Button.js';
import { inputBox } from '../components/inputBox.js';
import { textBox } from '../components/textBox.js';
import { postingImageUploadForm } from '../components/postingImageUploadForm.js';

const updateInnerHTML = (selector, position, contents) => {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = '';
        contents.forEach(content => {
            element.insertAdjacentHTML(position, content);
        });
    }
};

const fetchPageByPostId = async (postId) => {
    const response = await fetch(`${BASEURL}/post/page_number/${postId}`);
    const data = await response.json();
    return data.pageNumber;
}

const getPostIdAndPageNumber = () => {
    const hashString = window.location.hash;
    const urlParams = new URLSearchParams(hashString.substring(1));
    const postId = urlParams.get('post');
    const pageNumber = urlParams.get('page');
    return [postId, pageNumber];
}

const fetchPostDetail = async () => {
    const [postId, _] = getPostIdAndPageNumber();
    if (!postId) return null;
    const response = await fetch(`${BASEURL}/post/${postId}`);
    const data = await response.json();
    return data;
}

const render = async () => {

    const postDetail = await fetchPostDetail();
    postDetail ? sessionStorage.setItem('postDetail', JSON.stringify(postDetail)) : sessionStorage.setItem('postDetail', '');

    updateInnerHTML(`#navigation-right-group`, `afterbegin`, [memberPageNavRightGroup()]);

    updateInnerHTML(`#mypage-form`, `beforeend`, [
        button({
            id: 'myPage',
            text: '마이페이지',
            size: 'small',
            disabled: false,
        })
    ]);

    updateInnerHTML(`#logout-form`, `beforeend`, [
        button({
            id: 'logout',
            text: '로그아웃',
            size: 'small',
            disabled: false,
        })
    ]);

    updateInnerHTML('#title-input-box', 'beforeend', [
        inputBox({
            id: 'title',
            name: 'title',
            label: '제목',
            type: 'text',
            placeholder: '글의 제목을 입력하세요',
            value: postDetail ? postDetail.title : '',
        })
    ]);

    updateInnerHTML('#content-input-box', 'beforeend', [
        textBox({
            value: postDetail ? postDetail.content : null,
        })
    ]);

    updateInnerHTML('#submit-button', 'beforeend', [
        button({
            id: 'submit',
            text: '작성완료',
            size: 'small',
            disabled: true,
        })
    ]);

    updateInnerHTML('#image-upload-form', 'beforeend', [
        button({
            text: '이미지 업로드',
            size: 'small',
            disabled: false,
            id: 'image-upload',
            type: "button"
        }),
        postingImageUploadForm,
    ]);
}

const handleEventListeners = async () => {

    const checkInputValues = () => {
        const titleInput = document.querySelector('#title');
        const contentInput = document.querySelector('#content');
        const submitButton = document.querySelector('#submit');
        if (titleInput.value.trim() !== '' && contentInput.value.trim() !== '') {
            submitButton.disabled = false;  
        } else {
            submitButton.disabled = true;
        }
    }

    document.addEventListener('input', (e) => {
        if(e.target.id === 'title') {
            checkInputValues();
        }
        else if(e.target.id === 'content') {
            checkInputValues();
        }
    });

    document.addEventListener('click', async (e) => {
        if (e.target.id === 'myPage') {
            location.href = `/${STATIC_URL}/mypage`;
        }
        else if (e.target.id === 'logout') {
            location.href = `/${STATIC_URL}/logout`;
        }
        else if (e.target.id === 'submit') {
            const postDetail = JSON.parse(sessionStorage.getItem('postDetail') || '{}');
            const title = document.querySelector('#title').value;
            const content = document.querySelector('#content').value;
            const response = await fetch(`${BASEURL}/post/${postDetail.id ? '' : postDetail.id}`, {
                method: postDetail.id ? 'POST' : 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    content: content
                })
            });

            const data = await response.json();
            const postId = data.postId;
            const pageNumber = await fetchPageByPostId(postId);

            if (response.status === 201) {
                const fileInput = document.getElementById('image-input');
                const file = fileInput.files[0];
                console.log('file: ', file);
                if (file) {
                    const formData = new FormData();
                    formData.append('image', file);

                    const response = await fetch(`${BASEURL}/image/upload/${postId}`, {
                        method: 'POST',
                        body: formData,
                    });
                }

                location.href = `/${STATIC_URL}/post#page=${pageNumber}&post=${postId}`;
            }
        }
        else if (e.target.id === 'image-upload') {
            const fileInput = document.getElementById('image-input');
            fileInput.click();
        }
    });


    document.addEventListener('change', (e) => {
        if (e.target.id === 'image-input') {
            const fileNameDiv = document.getElementById('file-name');
            console.log(e.target.files);
            const file = e.target.files[0];
            fileNameDiv.textContent = file ? `선택된 파일: ${file.name}` : '선택된 파일 없음';
        }
    });

    // titleInput.addEventListener('input', checkInputValues);
    // contentInput.addEventListener('input', checkInputValues);
}

(async () => {
    await render()
    await handleEventListeners();
 })();
