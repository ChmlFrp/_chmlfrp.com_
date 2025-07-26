// Find this section in launchers's <script> section and replace it:


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
