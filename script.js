try {
    let content = '';

    // If it's CPL card, load version information
    if (apiUrl && launcherName === 'ChmlFrp_Professional_Launcher') {
        const apiResponse = await fetch(apiUrl);
        const apiData = await apiResponse.json();
        
        // Notice we're keeping the update content as raw text in a pre tag
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
    // If it's CUL card, load version information
    else if (apiUrl && launcherName === 'CHMLFRP-UI-Launcher') {
        const apiResponse = await fetch(apiUrl);
        const apiData = await apiResponse.json();
        const tagName = apiData.tag_name || '未知版本';
        let downloadUrl = '暂无下载链接';
        if (apiData.assets && apiData.assets.length > 0) {
            downloadUrl = apiData.assets[0].browser_download_url;
        }
        
        // Same here, keeping update content as raw text
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

    // Load Markdown file and convert to HTML as before
    const response = await fetch(mdUrl);
    const markdown = await response.text();
    content += marked.parse(markdown);

    // Update modal content
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