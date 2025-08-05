import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

export const postDetailBody = ({ title, author, created_at, viewCount, content, imagesPath = null }) => {
    let images = ``;
    if(imagesPath) imagesPath.forEach(path => {
        images += `<img src="${path}" alt="post-image">
        `;
    });
    console.log(imagesPath, images);
    return`
<h2>${title}</h2>
<div class="post-info">
    <p>작성자: ${author}</p>
    <p>작성일자: ${created_at}</p>
    <p>조회: ${viewCount}</p>
</div>
<div class="post-content">
    ${images}
    <p>
        ${marked.parse(content)}
    </p>
</div>
`
}
