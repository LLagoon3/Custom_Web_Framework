import { mainGuestPage } from "./mainGuestPage.js";
import { mainMemberPage } from "./mainMemberPage.js";
import { pagination } from "../components/pagination.js";
import { postItem } from "../components/postItem.js";
import { postCount } from "../components/postCount.js";
import { getCookie } from "./util.js";
import { BASEURL, STATIC_URL, POST_PER_PAGE } from "./config.js";

const updateInnerHTML = (selector, content) => {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = '';
        element.insertAdjacentHTML('beforeend', content);
    }
};

const getPageFromURL = () => {
    const hashString = window.location.hash;
    const queryString = hashString.substring(1);
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('page') || 1;
};

const fetchPageData = async (page) => {
    const postCountPromise = fetch(`${BASEURL}/post/count`).then(res => res.json());
    const postListPromise = fetch(`${BASEURL}/post/page/${page}`).then(res => res.json());
    
    const [postCountData, postListData] = await Promise.all([postCountPromise, postListPromise]);
    
    return {
        totalPostCount: postCountData.totalPosts,
        postList: postListData,
    };
};

const render = async () => {
    const pageNumber = getPageFromURL();
    
    const { totalPostCount, postList } = await fetchPageData(pageNumber);

    updateInnerHTML('#post-count', postCount(totalPostCount));

    updateInnerHTML('#pagination', pagination({
        currentPage: pageNumber,
        totalPage: Math.ceil(totalPostCount / POST_PER_PAGE),
    }));

    const posts = postList.map(post => postItem({
        id: post.id,
        title: post.title,
        nickname: post.nickname,
        viewCount: post.view_count,
        date: post.created_at,
        pageNumber: pageNumber,
    })).join('');
    
    updateInnerHTML('#post-group', posts);
};

const handleEventListeners = () => {
    document.addEventListener('click', (e) => {
        const href = e.target.getAttribute('href');
        if (href && href.includes('page=') && !href.includes('post=')) {
            e.preventDefault(); 
            window.history.pushState({}, '', href); 
            render(); 
        }
        else if(e.target.id === 'write') {
            location.href = `/${STATIC_URL}/write`;
        }
    });
};

const mainPage = async () => {
    // 로그인 여부를 쿠키값으로 판단하는 것이 맞는가?
    const nickname = getCookie('nickname');
    if (nickname) {
        mainMemberPage();
    } else {
        mainGuestPage();
    }
    
    await render();
    handleEventListeners();
}

mainPage();
