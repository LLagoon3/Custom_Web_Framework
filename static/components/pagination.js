export const pagination = ({ currentPage, totalPage }) => {
    let pages = [];
    
    const pageGroup = Math.floor((parseInt(currentPage) - 1) / 5);
    const prevPage = pageGroup === 0 ? 1 : pageGroup * 5;
    const nextPage = (pageGroup * 5) + 6;
    
    pages.push(`<li><a href="#?page=${prevPage}">&#60;</a></li>
    `);
    if (prevPage === 1) pages.push(`<li><a href="#?page=1">1</a></li>
        `);
    for (let i = prevPage + 1; i < nextPage; i++) {
        if (i > totalPage) break;
        else if(i === parseInt(currentPage)) pages.push(`<li><a class="current-page" href="#?page=${i}">${i}</a></li>`);
        else pages.push(`<li><a href="#?page=${i}">${i}</a></li>`);
        }
        pages.push(`<li><a href="#?page=${nextPage}">&#62;</a></li>
    `);
    
    return pages.join('');
}
        