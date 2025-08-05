export const textBox = ({ value }) => {
    return `
    <textarea 
        id="content" 
        name="content" 
        placeholder="글의 내용을 입력하세요" 
        rows="40">${value || ''}</textarea>
`
}