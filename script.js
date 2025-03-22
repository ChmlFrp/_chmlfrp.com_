document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div id="markdown-content"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    cards.forEach(card => {
        card.addEventListener('click', async () => {
            const mdUrl = card.getAttribute('data-md-url');
            if (mdUrl) {
                try {
                    const response = await fetch(mdUrl);
                    const markdown = await response.text();
                    const markdownContent = document.getElementById('markdown-content');
                    markdownContent.innerHTML = marked.parse(markdown); // 使用 marked.js 解析 Markdown
                    modal.style.display = 'block';
                } catch (error) {
                    console.error('Failed to load Markdown:', error);
                }
            }
        });
    });
});
