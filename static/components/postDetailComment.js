export const postDetailComment = ( comments, clientNickname = null ) => {
    const comment = ( { id, nickname, content, created_at }) => 
    // <div class="comment">
    //     <p class="comment-user">${nickname}</p>
    //     <p class="comment-content">${content}</p>
    //     <p class="comment-date">${created_at}</p>
    // </div>
    `
    <div class="comment">
        <div class="comment-body">
            <p class="comment-user">${nickname}</p>
            <p class="comment-content">${content}</p>
            <p class="comment-date">${created_at}</p>
        </div>
        ${clientNickname === nickname ? `
        <div class="comment-button-group" data-commentid=${id}>
            <button id="comment-modify">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button id="comment-delete" data-commentid=${id}>
                <i class="fa-solid fa-x"></i>
            </button>
        </div>
        ` : ''}
    </div>
    `
    return `
    <h3>댓글 ${comments.length}개</h3>
    ${comments.map(comment).join('')}
    `
}