// Find this section in launchers's <script> section and replace it:

// 卡片点击事件
cards.forEach(card => {
    card.addEventListener('click', async () => {
        const mdUrl = card.getAttribute('data-md-url');
        const apiUrl = card.getAttribute('data-api-url');
        const launcherName = card.querySelector('.launcher-name').textContent;

        // 更新模态框标题
        document.querySelector('.modal-title').textContent = launcherName + ' 详情';

        // 显示弹窗和加载动画
        modal.style.display = 'block';
        markdownContent.innerHTML = `
            <div class="loader"></div>
            <p style="text-align: center;">加载中，请稍候...</p>
        `;

        try {
            let content = '';

            // 如果是 CPL 卡片，加载版本信息
            if (apiUrl && launcherName === 'ChmlFrp_Professional_Launcher') {
                const apiResponse = await fetch(apiUrl);
                const apiData = await apiResponse.json();
                content += `
                    <div class="version-info">
                        <h3><i class="fas fa-tag"></i> 最新版本: ${apiData.version}</h3>
                        <div class="update-notes">
                            <h4>更新内容:</h4>
                            <div class="markdown-display">
                                <pre class="markdown-code">${apiData.text}</pre>
                            </div>
                        </div>
                        <a href="${apiData.url}" class="download-btn" target="_blank">
                            <i class="fas fa-download"></i> 下载最新版本
                        </a>
                    </div>
                    <hr>
                `;
            }
            // 如果是 CUL 卡片，加载版本信息
            else if (apiUrl && launcherName === 'CHMLFRP-UI-Launcher') {
                const apiResponse = await fetch(apiUrl);
                const apiData = await apiResponse.json();
                const tagName = apiData.tag_name || '未知版本';
                let downloadUrl = '暂无下载链接';
                if (apiData.assets && apiData.assets.length > 0) {
                    downloadUrl = apiData.assets[0].browser_download_url;
                }
                content += `
                    <div class="version-info">
                        <h3><i class="fas fa-tag"></i> 最新版本: ${tagName}</h3>
                        <div class="update-notes">
                            <h4>更新内容:</h4>
                            <div class="markdown-display">
                                <pre class="markdown-code">${apiData.body}</pre>
                            </div>
                        </div>
                        <a href="${downloadUrl}" class="download-btn" target="_blank">
                            <i class="fas fa-download"></i> 下载最新版本
                        </a>
                    </div>
                    <hr>
                `;
            }

            // 加载 Markdown 文件
            const response = await fetch(mdUrl);
            const markdown = await response.text();
            content += marked.parse(markdown);

            // 更新弹窗内容
            markdownContent.innerHTML = content;
        } catch (error) {
            console.error('加载失败:', error);
            markdownContent.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>加载内容失败，请稍后重试。</p>
                    <p>错误信息: ${error.message}</p>
                </div>
            `;
        }
    });
});

// Add this code at the end of your document.addEventListener('DOMContentLoaded', function() {...}) block

// Fetch CPL version info at page load and update download link
async function updateCPLDownloadLink() {
    try {
        const cplCard = document.getElementById('cpl');
        if (!cplCard) return;
        
        const apiUrl = cplCard.getAttribute('data-api-url');
        const downloadBtn = document.getElementById('cpl-download-btn');
        
        if (!apiUrl || !downloadBtn) return;
        
        // Fetch the version data
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data.url) {
            // Create accelerated download link with ghproxy
            const acceleratedUrl = 'https://ghproxy.net/' + data.url;
            downloadBtn.href = acceleratedUrl;
            
            // Optionally update button text to include version
            downloadBtn.innerHTML = `<i class="fas fa-download"></i> 加速下载 v${data.version}`;
            
            console.log('CPL download link updated successfully');
        }
    } catch (error) {
        console.error('Error updating CPL download link:', error);
    }
}

// Call this function when the page loads
updateCPLDownloadLink();

// 获取ping数据
let pingTime = 24; // 默认值
try {
    const pingStart = performance.now();
    await fetch('https://cf-v2.uapis.cn', { method: 'GET', cache: 'no-store' });
    const pingEnd = performance.now();
    pingTime = Math.round((pingEnd - pingStart) / 8);
} catch (pingError) {
    console.error('Ping测试失败:', pingError);
}

// 更新ping响应时间显示
document.querySelector('.stats-grid .stat-item:nth-child(2) .stat-value').textContent = `${pingTime}ms`;
