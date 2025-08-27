// متغيرات التحكم في الإعلانات
const adConfig = {
    bannerPosition: 'bottom',
    interstitialFrequency: 3,
    rewardedForDownloads: true,
    rewardedForInteractive: true,
    childSafe: true
};

// عداد التنقلات العالمي
let navigationCounter = 0;
let currentPage = 'home';

// دوال الإعلانات
function showBannerAd(position = 'bottom') {
    console.log(\[AdMob] Showing banner ad at \\);
    const adContainer = document.getElementById('adContainer');
    if (adContainer) {
        adContainer.innerHTML = \
            <div class="ad-banner">
                <div class="ad-placeholder">📢 إعلان تعليمي</div>
            </div>
        \;
    }
}

function showInterstitialAd() {
    console.log('[AdMob] Showing interstitial ad');
    const popup = document.createElement('div');
    popup.className = 'ad-interstitial';
    popup.innerHTML = \
        <div class="ad-content">
            <h3>إعلان</h3>
            <p>هذا الإعلان سينتهي خلال 5 ثواني</p>
            <div class="ad-timer">
                <div class="timer-bar"></div>
            </div>
        </div>
    \;
    document.body.appendChild(popup);
    
    const timerBar = popup.querySelector('.timer-bar');
    let timeLeft = 5;
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerBar.style.width = \\%\;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            popup.remove();
        }
    }, 1000);
    
    popup.addEventListener('click', () => {
        clearInterval(timerInterval);
        popup.remove();
    });
}

function showRewardedAd(onReward) {
    console.log('[AdMob] Showing rewarded ad');
    const popup = document.createElement('div');
    popup.className = 'ad-rewarded';
    popup.innerHTML = \
        <div class="ad-content">
            <h3>🎁 شاهد الإعلان للحصول على المكافأة</h3>
            <p>شاهد إعلانًا قصيرًا لفتح المحتوى</p>
            <div class="ad-buttons">
                <button class="watch-btn" onclick="this.parentElement.parentElement.remove(); (\)()">
                    <i class="fas fa-play"></i> شاهد الإعلان
                </button>
                <button class="skip-btn" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i> تخطي
                </button>
            </div>
        </div>
    \;
    document.body.appendChild(popup);
}

// دوال التنقل
function showHomePage() {
    console.log('Showing home page');
    hideAllPages();
    document.getElementById('homePage').classList.add('active');
    currentPage = 'home';
    navigationCounter++;
    updateBottomNav('home');
    showBannerAd();
    loadAds();
}

function showTermsPage(grade) {
    console.log('Showing terms page for grade:', grade);
    hideAllPages();
    document.getElementById('termsPage').classList.add('active');
    currentPage = 'terms';
    navigationCounter++;
    
    if (navigationCounter % adConfig.interstitialFrequency === 0) {
        showInterstitialAd();
    }
    
    document.getElementById('selectedGradeTitle').textContent = \اختر الترم الدراسي - \System.Collections.Hashtable\;
    localStorage.setItem('selectedGrade', grade);
    updateBottomNav('terms');
    showBannerAd();
}

function showSubjectsPage(term) {
    console.log('Showing subjects page for term:', term);
    hideAllPages();
    document.getElementById('subjectsPage').classList.add('active');
    currentPage = 'subjects';
    navigationCounter++;
    
    if (navigationCounter % adConfig.interstitialFrequency === 0) {
        showInterstitialAd();
    }
    
    const grade = localStorage.getItem('selectedGrade') || '';
    console.log('Selected grade from storage:', grade);
    document.getElementById('selectedSubjectTitle').textContent = \المواد - \System.Collections.Hashtable - \الترم الثاني\;
    localStorage.setItem('selectedTerm', term);
    updateBottomNav('subjects');
    loadFiles();
    showBannerAd();
}

function hideAllPages() {
    console.log('Hiding all pages');
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
}

// دوال التنقل السفلي
function updateBottomNav(page) {
    const homeBtn = document.getElementById('homeNavBtn');
    const backBtn = document.getElementById('backNavBtn');
    const termsBtn = document.getElementById('termsNavBtn');
    
    homeBtn.style.display = 'none';
    backBtn.style.display = 'none';
    termsBtn.style.display = 'none';
    
    homeBtn.classList.remove('active');
    backBtn.classList.remove('active');
    termsBtn.classList.remove('active');
    
    switch(page) {
        case 'home':
            homeBtn.style.display = 'flex';
            homeBtn.classList.add('active');
            break;
        case 'terms':
            homeBtn.style.display = 'flex';
            backBtn.style.display = 'flex';
            backBtn.classList.add('active');
            break;
        case 'subjects':
            homeBtn.style.display = 'flex';
            backBtn.style.display = 'flex';
            termsBtn.style.display = 'flex';
            backBtn.classList.add('active');
            break;
    }
}

function goBack() {
    console.log('Going back from page:', currentPage);
    
    switch(currentPage) {
        case 'terms':
            showHomePage();
            break;
        case 'subjects':
            const grade = localStorage.getItem('selectedGrade') || '';
            showTermsPage(grade);
            break;
        default:
            showHomePage();
    }
}

function goToTerms() {
    console.log('Going to terms page');
    const grade = localStorage.getItem('selectedGrade') || '';
    showTermsPage(grade);
}

// تحويل الروابط وتحميل الملفات
function convertToRawURL(githubURL) {
    return githubURL
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');
}

async function loadFiles() {
    console.log('Loading files from GitHub');
    try {
        const response = await fetch('https://raw.githubusercontent.com/Moamin1987/madrasati/main/data/files.json');
        if (!response.ok) {
            throw new Error('فشل تحميل الملفات');
        }
        
        const files = await response.json();
        console.log('Files loaded:', files);
        
        const processedFiles = files.map(file => ({
            ...file,
            url: convertToRawURL(file.github_url)
        }));
        
        displayFiles(processedFiles);
    } catch (error) {
        console.error('فشل تحميل الملفات:', error);
        showEmptyState();
    }
}

// عرض الملفات
function displayFiles(files) {
    console.log('Displaying files:', files);
    const gamesList = document.getElementById('gamesList');
    const lessonsList = document.getElementById('lessonsList');
    
    gamesList.innerHTML = '';
    lessonsList.innerHTML = '';
    
    const gamesFiles = files.filter(file => file.section === 'games');
    const lessonsFiles = files.filter(file => file.section === 'lessons');
    
    console.log('Games files:', gamesFiles);
    console.log('Lessons files:', lessonsFiles);
    
    if (gamesFiles.length > 0) {
        gamesFiles.forEach(file => {
            gamesList.appendChild(createFileElement(file));
        });
    } else {
        gamesList.innerHTML = '<div class="empty-state">لا توجد ألعاب متاحة حالياً</div>';
    }
    
    if (lessonsFiles.length > 0) {
        lessonsFiles.forEach(file => {
            lessonsList.appendChild(createFileElement(file));
        });
    } else {
        lessonsList.innerHTML = '<div class="empty-state">لا توجد دروس متاحة حالياً</div>';
    }
}

function getFileMetadata(file) {
    if (file.metadata) {
        return file.metadata;
    }
    
    const nameWithoutExt = file.name.replace(/\\.[^/.]+$/, "");
    const parts = nameWithoutExt.split('_');
    
    return {
        author: "فريق تطوير مدرستي",
        title: nameWithoutExt,
        description: "ملف تعليمي مفيد",
        year: "2026",
        subject: parts[0] || "عام",
        grade: parts[1] || "غير محدد",
        term: parts[2] || "غير محدد"
    };
}

function createFileElement(file) {
    console.log('Creating file element for:', file);
    const div = document.createElement('div');
    div.className = 'file-item';
    div.setAttribute('role', 'button');
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', \ملف: \\);
    
    const metadata = getFileMetadata(file);
    
    div.innerHTML = \
        <div class="file-content">
            <div class="file-header">
                <div class="file-icon">\</div>
                <div class="file-info">
                    <div class="file-name">\</div>
                    <div class="file-author">✍️ \</div>
                </div>
            </div>
            <div class="file-metadata">
                <div class="metadata-title">\</div>
                <div class="metadata-description">\</div>
                <div class="metadata-details">
                    <span class="metadata-grade">\</span>
                    <span class="metadata-term">\</span>
                    <span class="metadata-year">\</span>
                </div>
            </div>
            <div class="file-actions">
                <button class="preview-btn" onclick="showFilePreview('\', '\', \)">
                    <i class="fas fa-eye"></i> معاينة
                </button>
                <button class="download-btn" onclick="handleDownload('\', '\')">
                    <i class="fas fa-download"></i> تحميل
                </button>
            </div>
        </div>
    \;
    
    div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            div.click();
        }
    });
    
    return div;
}

function handleDownload(url, filename) {
    console.log('Downloading file:', filename);
    
    if (adConfig.rewardedForDownloads) {
        showRewardedAd(() => {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function showFilePreview(url, filename, metadata) {
    console.log('Showing preview for:', filename);
    
    if (adConfig.rewardedForInteractive) {
        showRewardedAd(() => {
            createPreviewModal(url, filename, metadata);
        });
    } else {
        createPreviewModal(url, filename, metadata);
    }
}

function createPreviewModal(url, filename, metadata) {
    const modal = document.createElement('div');
    modal.className = 'file-preview-modal';
    modal.innerHTML = \
        <div class="modal-content">
            <div class="modal-header">
                <h3>\</h3>
                <button class="close-modal" onclick="this.closest('.file-preview-modal').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="preview-info">
                    <div class="info-row">
                        <span class="info-label">المؤلف:</span>
                        <span class="info-value">\</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">الصف:</span>
                        <span class="info-value">\</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">الترم:</span>
                        <span class="info-value">\</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">السنة:</span>
                        <span class="info-value">\</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">المادة:</span>
                        <span class="info-value">\</span>
                    </div>
                </div>
                <div class="preview-description">
                    <h4>الوصف:</h4>
                    <p>\</p>
                </div>
                <div class="preview-actions">
                    <button class="download-action-btn" onclick="handleDownload('\', '\'); this.closest('.file-preview-modal').remove();">
                        <i class="fas fa-download"></i> تحميل الملف
                    </button>
                    <button class="share-btn" onclick="shareFile('\', '\')">
                        <i class="fas fa-share"></i> مشاركة
                    </button>
                </div>
                <div class="thank-you-message">
                    <h4>شكراً لثقتك بنا!</h4>
                    <p>نسعى دائمًا لتقديم الأفضل! إذا أعجبك التطبيق واستفدت منه، لا تنسانا من صالح دعائك، وسيكون تقييمك الإيجابي أكبر دعم لنا.</p>
                </div>
            </div>
        </div>
    \;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function shareFile(filename, title) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: \تفضل بتحميل \ من تطبيق مدرستي\,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('تم نسخ الرابط للحافظة!');
        });
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function getFileIcon(filename) {
    if (filename.endsWith('.html')) return '🎮';
    if (filename.endsWith('.pdf')) return '📕';
    if (filename.endsWith('.doc') || filename.endsWith('.docx')) return '📘';
    if (filename.endsWith('.ppt') || filename.endsWith('.pptx')) return '📊';
    if (filename.endsWith('.mp4') || filename.endsWith('.avi')) return '🎬';
    if (filename.endsWith('.mp3') || filename.endsWith('.wav')) return '🎵';
    if (filename.endsWith('.zip') || filename.endsWith('.rar')) return '📦';
    return '📄';
}

function showEmptyState() {
    console.log('Showing empty state');
    document.getElementById('gamesList').innerHTML = '<div class="empty-state">لا توجد ألعاب متاحة حالياً</div>';
    document.getElementById('lessonsList').innerHTML = '<div class="empty-state">لا توجد دروس متاحة حالياً</div>';
}

// النوافذ المنبثقة
function showCopyright() {
    console.log('Showing copyright popup');
    const popup = document.getElementById('copyrightPopup');
    if (popup) {
        popup.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        const firstFocusable = popup.querySelector('button');
        if (firstFocusable) firstFocusable.focus();
    }
}

function closePopup() {
    console.log('Closing copyright popup');
    const popup = document.getElementById('copyrightPopup');
    if (popup) {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// مستمعو الأحداث
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    const gradeCards = document.querySelectorAll('.grade-card');
    gradeCards.forEach(card => {
        card.addEventListener('click', function() {
            const grade = this.getAttribute('data-grade');
            console.log('Grade card clicked:', grade);
            showTermsPage(grade);
        });
    });
    
    const termCards = document.querySelectorAll('.term-card');
    termCards.forEach(card => {
        card.addEventListener('click', function() {
            const term = this.getAttribute('data-term');
            console.log('Term card clicked:', term);
            showSubjectsPage(term);
        });
    });
    
    const copyrightBtns = document.querySelectorAll('.copyright-icon');
    copyrightBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            console.log('Copyright button clicked');
            showCopyright();
        });
    });
    
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Close button clicked');
            closePopup();
        });
    }
    
    loadAds();
    updateBottomNav('home');
});

function loadAds() {
    console.log('Loading ads');
    showBannerAd();
}

document.addEventListener('click', function(event) {
    const popup = document.getElementById('copyrightPopup');
    if (event.target === popup) {
        closePopup();
    }
});
