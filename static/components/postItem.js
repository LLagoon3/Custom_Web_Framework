export const postItem = ({ id, title, nickname, date, viewCount, pageNumber }) => `
<tr>
    <td>
        <li><a href="/was/post#page=${pageNumber}&post=${id}">${title}</a></li>
    </td>
    <td>${nickname}</td>
    <td>${date}</td>
    <td>${viewCount}</td>
</tr>
`