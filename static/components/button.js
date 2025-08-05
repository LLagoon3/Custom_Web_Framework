export const button = ({ id, text, size, disabled, href = null, type = null }) => {
    if (href) {
        return `
        <a href="${href}" method="GET">
            <button class="button ${size}" id="${id}" ${disabled ? 'disabled' : ''} ${type ? `type=${type}` : ''}>
                    ${text}
            </button>
        </a>
        `;
    }
    return `
    <button class="button ${size}" id="${id}" ${disabled ? 'disabled' : ''} ${type ? `type=${type}` : ''}>
        ${text}
    </button>
    `;
}