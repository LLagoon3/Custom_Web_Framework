import { BASEURL, POST_PER_PAGE, STATIC_URL } from './config.js';
import { memberPageNavRightGroup } from '../components/navRightGroup.js';
import { button } from '../components/Button.js';
import { postDetailBody } from '../components/postDetailBody.js';
import { postDetailComment } from '../components/postDetailComment.js';
import { getCookie } from "./util.js";


const updateInnerHTML = (selector, position, contents) => {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = '';
        contents.forEach(content => {
            element.insertAdjacentHTML(position, content);
        });
    }
};

const getPostIdAndPageNumber = () => {
    // URL Path 방식
    // const urlPath = window.location.pathname;
    // const segments = urlPath.split('/');
    // const postId = segments.pop();
    // return postId;

    // 쿼리스트링 방식
    const hashString = window.location.hash;
    const urlParams = new URLSearchParams(hashString.substring(1)); // "post=1035"
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

const fetchPageByPostId = async (postId) => {
    const response = await fetch(`${BASEURL}/post/page_number/${postId}`);
    const data = await response.json();
    return data.pageNumber;
}

const fetchPrevAndNextPostId = async (postId) => {
    const response = await fetch(`${BASEURL}/post/prev_and_next/${postId}`);
    const data = await response.json();
    return data;
    // // id 기준 정렬이기 때문에 prev와 next가 반대로 나옴
    // return {
    //     prevPostId: data.nextPostId,
    //     nextPostId: data.prevPostId,
    // };
}

const fetchComment = async (postId) => {
    const response = await fetch(`${BASEURL}/comment/${postId}`);
    const data = await response.json();
    return data;
}

const fetchImage = async (postId) => {
    const response = await fetch(`${BASEURL}/image/${postId}`);
    const data = await response.json();
    return data;
}


const getPostMoveButton = async () => {
    const [postId, _] = getPostIdAndPageNumber();
    const { nextPostId, prevPostId } = await fetchPrevAndNextPostId(postId);
    const nextPostPageNumber = nextPostId ? await fetchPageByPostId(nextPostId) : null;
    const prevPostPageNumber = prevPostId ? await fetchPageByPostId(prevPostId) : null;
    
    return [
        button({
            id: 'prev',
            text: '이전',
            size: 'small',
            disabled: prevPostId ? false : true,
            href: `/${STATIC_URL}/post#page=${prevPostPageNumber}&post=${prevPostId}`,
        }),
        button({
            id: 'next',
            text: '다음',
            size: 'small',
            disabled: nextPostId ? false : true,
            href: `/${STATIC_URL}/post#page=${nextPostPageNumber}&post=${nextPostId}`,
        })
    ];
}

const render = async () => {

    const nickname = getCookie('nickname');
    const [postId, pageNumber] = getPostIdAndPageNumber();

    const commentInput = document.querySelector('#comment-input');
    commentInput.value = '';

    updateInnerHTML(`#navigation-right-group`, `afterbegin`, [memberPageNavRightGroup()]);

    if (nickname) {
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
    }
    else {
        updateInnerHTML(`#navigation-right-group`, `beforeend`, [
            button({
                id: 'loginOrRegister',
                text: '로그인/회원가입',
                size: 'small',
                href: `/${STATIC_URL}/login`,
                disabled: false,
            })
        ]);
    }

    const images = await fetchImage(postId);
    const imagesPath = []
    if(images) images.forEach(image => {
        imagesPath.push(`${BASEURL}/${STATIC_URL}${image.file_path}`);
    });

    const postDetail = await fetchPostDetail();
    sessionStorage.setItem('postDetail', JSON.stringify(postDetail));

    updateInnerHTML(`#post-detail-body`, `beforeend`, [
        postDetailBody({
            title: postDetail.title,
            author: postDetail.nickname,
            created_at: postDetail.created_at,
            // content: postDetail.content.replaceAll('\n', '<br>'),
            content: postDetail.content,
            viewCount: postDetail.view_count,
            imagesPath: imagesPath,
        })
    ]);

    updateInnerHTML('#post-detail-button-group', 'beforeend', [
        button({
            id: 'edit',
            text: '수정',
            size: 'small',
            href: `/${STATIC_URL}/write#page=${pageNumber}&post=${postId}`,
            disabled: nickname === postDetail.nickname ? false : true,
        }),
        button({
            id: 'delete',
            text: '삭제',
            size: 'small',
            disabled: nickname === postDetail.nickname ? false : true,
        }),
    ]);
    
    const comments = await fetchComment(postId);

    updateInnerHTML(`#comments`, `beforeend`, [
        postDetailComment(comments, nickname),
    ]);

    const commentUser = document.querySelector(`#comment-user`);
    commentUser.textContent = nickname || 'Unknown';

    if (!nickname) {
        commentInput.disabled = true;
        commentInput.placeholder = '로그인 후 댓글을 작성할 수 있습니다.';
    }

    updateInnerHTML(`#comment-form-submit`, `beforeend`, [
        button({
            id: 'submit',
            text: '작성',
            size: 'small',
            disabled: true,
        })
    ]);

    updateInnerHTML(`#pagination-right-group`, `beforeend`, [
        button({
            id: 'list',
            text: '목록',
            size: 'small',
            disabled: false,
        })
    ]);

    updateInnerHTML(`#pagination-left-group`, `beforeend`, await getPostMoveButton()); 
}

const handleEventListeners = async () => {
    document.body.addEventListener('input', (event) => {
        if (event.target.id === 'comment-input') {
            const submitButton = document.querySelector('#submit');
            const inputField = event.target;
            if (inputField.value.trim() !== '') {
                submitButton.disabled = false; 
            } else {
                submitButton.disabled = true;
            }
        }
    });

    document.addEventListener('click', async (e) => {
        if (e.target.id === 'list') {
            const [_, pageNumber] = getPostIdAndPageNumber();
            window.location.href = `/${STATIC_URL}/#?page=${pageNumber}`;
        }
        else if (e.target.id === 'prev') {
            setTimeout(() => {
                render();
            }, 100);
        }
        else if (e.target.id === 'next') {
            setTimeout(() => {
                render();
            }, 100);
        }
        else if (e.target.id === 'myPage') {
            window.location.href = `/${STATIC_URL}/myPage`;
        }
        else if (e.target.id === 'logout') {
            window.location.href = `/${STATIC_URL}/login`;
        }
        else if (e.target.id === 'delete') {
            const confirmed = confirm('정말로 삭제하시겠습니까?');
            if (confirmed) {
                const [postId, _] = getPostIdAndPageNumber();
                const response = await fetch(`${BASEURL}/post/${postId}`, { method: 'DELETE' });
                window.location.href = `/${STATIC_URL}/`;
            }
        }
        else if (e.target.id === 'submit') {
            e.preventDefault();
            const commentInput = document.querySelector('#comment-input');
            const comment = commentInput.value;
            const [postId, _] = getPostIdAndPageNumber();
            const response = await fetch(`${BASEURL}/comment/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: comment,
                })
            });
            const data = await response.json();
            if (response.status === 200) {
                commentInput.value = '';
                render();
            }
        }
        else if (e.target.id === 'comment-modify') {
            pass;
        }
        else if (e.target.id === 'comment-delete') {
            const commentId = e.target.dataset.commentid;
            const confirmed = confirm('정말로 삭제하시겠습니까?');
            if (confirmed) {
                const response = await fetch(`${BASEURL}/comment/${commentId}`, { method: 'DELETE' });
                if(response.status === 204) {
                    render();
                }
            }   
        }
    });
}

await render();
handleEventListeners();