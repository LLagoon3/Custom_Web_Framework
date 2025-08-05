export const inputBox = ({ id, name, label, type, placeholder, value = '', required = true, disabled = false }) => `
<div class = "input-container ${disabled ? 'disabled' : ''}">
    <label>${label}</label>
    <input
        name=${name}
        type=${type}
        placeholder="${placeholder}"
        value="${value}"
        id="${id}"
        ${required ? 'required' : ''}
        ${disabled ? 'disabled' : ''}
    />
</div>
`