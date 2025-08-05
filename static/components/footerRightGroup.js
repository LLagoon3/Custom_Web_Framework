export const memberPageFooterRightGroup = () => `
<form class="search-input-container" action="/post/search/" method="GET">
    <input class="search-input" type="text" name="search" placeholder="검색어를 입력하세요.">
    <button class="search-button">
        <i class="fa-solid fa-magnifying-glass"></i>
    </button>
</form>
`