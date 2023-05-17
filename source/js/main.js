function setFixed(el) {
    if (!el) return
    const currentTop = window.scrollY || document.documentElement.scrollTop
    if (currentTop > 0) {
        el.classList.add('nav-fixed')
    } else {
        el.classList.remove('nav-fixed')
    }
}

const scrollFn = function () {
    const innerHeight = window.innerHeight + 0
    const $header = document.getElementById('page-header')
    setFixed($header)
    if (document.body.scrollHeight <= innerHeight) {
        return
    }
    let initTop = 0
    window.addEventListener('scroll', utils.throttle(function (e) {
        const currentTop = window.scrollY || document.documentElement.scrollTop
        const isDown = scrollDirection(currentTop)
        if (currentTop > 0) {
            if (isDown) {
                if ($header.classList.contains('nav-visible')) $header.classList.remove(
                    'nav-visible')
            } else {
                if (!$header.classList.contains('nav-visible')) $header.classList.add(
                    'nav-visible')
            }
            $header.classList.add('nav-fixed')
        } else {
            if (currentTop === 0) {
                $header.classList.remove('nav-fixed', 'nav-visible')
            }
        }
        percent()
    }, 200))
    function scrollDirection(currentTop) {
        const result = currentTop > initTop
        initTop = currentTop
        return result
    }
}

const sidebarFn = () => {
    const $toggleMenu = document.getElementById('toggle-menu')
    const $mobileSidebarMenus = document.getElementById('sidebar-menus')
    const $menuMask = document.getElementById('menu-mask')
    const $body = document.body

    if (!$toggleMenu) return

    function openMobileSidebar() {
        utils.sidebarPaddingR()
        $body.style.overflow = 'hidden'
        utils.fadeIn($menuMask, 0.5)
        $mobileSidebarMenus.classList.add('open')
    }

    function closeMobileSidebar() {
        $body.style.overflow = ''
        $body.style.paddingRight = ''
        utils.fadeOut($menuMask, 0.5)
        $mobileSidebarMenus.classList.remove('open')
    }

    $toggleMenu.addEventListener('click', openMobileSidebar)

    $menuMask.addEventListener('click', e => {
        if ($mobileSidebarMenus.classList.contains('open')) {
            closeMobileSidebar()
        }
    })

    window.addEventListener('resize', e => {
        if ($mobileSidebarMenus.classList.contains('open')) closeMobileSidebar()
    })
}

const showTodayCard = () => {
    const el = document.getElementById('todayCard')
    if (el) {
        document.getElementsByClassName('topGroup')[0].addEventListener('mouseleave', () => {
            if (el.classList.contains('hide')) {
                el.classList.remove('hide')
            }
        })
    }
}

const setTimeState = () => {
    const el = document.getElementById('author-info__sayhi')
    if (el) {
        const timeNow = new Date(), hours = timeNow.getHours(), lang = GLOBALCONFIG.lang.sayhello;
        let text = '';
        if (hours >= 0 && hours <= 5) {
            text = lang.goodnight;
        } else if (hours > 5 && hours <= 10) {
            text = lang.morning;
        } else if (hours > 10 && hours <= 14) {
            text = lang.noon;
        } else if (hours > 14 && hours <= 18) {
            text = lang.afternoon;
        } else if (hours > 18 && hours <= 24) {
            text = lang.night;
        }
        el.innerText = text + lang.iam;
    }
};

const chageTimeFormate = () => {
    const timeElements = document.getElementsByTagName("time"), lang = GLOBALCONFIG.lang.time
    for (var i = 0; i < timeElements.length; i++) {
        const datetime = timeElements[i].getAttribute("datetime"), timeObj = new Date(datetime), daysDiff = utils.timeDiff(timeObj, new Date())
        var timeString;
        if (daysDiff === 0) {
            timeString = lang.recent;
        } else if (daysDiff === 1) {
            timeString = lang.yesterday;
        } else if (daysDiff === 2) {
            timeString = lang.berforeYesterday;
        } else if (daysDiff <= 7) {
            timeString = daysDiff + lang.daybefore;
        } else {
            if (timeObj.getFullYear() !== new Date().getFullYear()) {
                timeString = timeObj.getFullYear() + "/" + (timeObj.getMonth() + 1) + "/" + timeObj.getDate();
            } else {
                timeString = (timeObj.getMonth() + 1) + "/" + timeObj.getDate();
            }
        }
        timeElements[i].textContent = timeString;
    }
}

const percent = () => {
    // 获取当前滚动条位置
    const scrollTop = document.documentElement.scrollTop || window.pageYOffset;
    // 获取文档根节点
    const docElem = document.documentElement;
    // 获取文档body节点
    const body = document.body;
    // 获取文档body高度
    const bodyScrollHeight = body.scrollHeight;
    // 获取文档根节点高度，取最大值
    const docScrollHeight = Math.max(docElem.scrollHeight, docElem.offsetHeight, bodyScrollHeight, body.clientHeight, docElem.clientHeight);
    // 计算当前滚动位置百分比
    const percentResult = Math.round(scrollTop / (docScrollHeight - docElem.clientHeight) * 100);
    // 获取百分比按钮节点
    const percentBtn = document.querySelector("#percent");
    // 获取“返回顶部”按钮节点
    const navTotop = document.querySelector("#nav-totop");
    // 获取需要隐藏的元素节点
    const needEndHide = document.querySelectorAll(".needEndHide");

    // 计算可视区域底部位置
    const visibleBottom = window.scrollY + docElem.clientHeight;
    // 获取事件监听器节点
    const eventlistner = document.getElementById('post-tools') || document.getElementById('footer');
    // 计算事件监听器垂直中心位置
    const centerY = eventlistner.offsetTop + (eventlistner.offsetHeight / 2);

    const text = GLOBALCONFIG.lang.theme.light;
    // 如果事件监听器中心位置小于可视区域底部位置或者滚动位置百分比大于90，则显示“返回顶部”按钮和需要隐藏的元素，并隐藏百分比按钮
    if (centerY < visibleBottom || percentResult > 90) {
        navTotop.classList.add("long");
        // percentBtn.innerHTML = GLOBALCONFIG.lang.nav.end;
        percentBtn.innerHTML = "End";
        needEndHide.forEach(item => item.classList.add("hide"));
    } else {
        // 否则隐藏“返回顶部”按钮和需要隐藏的元素，显示百分比按钮
        navTotop.classList.remove("long");
        if (percentResult >= 0) {
            percentBtn.innerHTML = percentResult;
            needEndHide.forEach(item => item.classList.remove("hide"));
        }
    }
}

class toc {
    static init() {
        const tocContainer = document.getElementById('card-toc')
        if (!tocContainer || !tocContainer.querySelector('.toc a')) {
            tocContainer.style.display = 'none'
            return
        }
        const el = document.querySelectorAll('.toc a')
        el.forEach((e) => {
            e.addEventListener('click', (event) => {
                event.preventDefault()
                utils.scrollToDest(utils.getEleTop(document.getElementById(decodeURI((event.target.className === 'toc-text' ? event.target.parentNode.hash : event.target.hash).replace('#', '')))), 300)
            })
        })
        this.active(el)
    }

    static active(toc) {
        const $article = document.getElementById('article-container')
        const $tocContent = document.getElementById('toc-content')
        const list = $article.querySelectorAll('h1,h2,h3,h4,h5,h6')
        let detectItem = ''
        function autoScroll(el) {
            const activePosition = el.getBoundingClientRect().top
            const sidebarScrollTop = $tocContent.scrollTop
            if (activePosition > (document.documentElement.clientHeight - 100)) {
                $tocContent.scrollTop = sidebarScrollTop + 150
            }
            if (activePosition < 100) {
                $tocContent.scrollTop = sidebarScrollTop - 150
            }
        }
        function findHeadPosition(top) {
            if (top === 0) {
                return false
            }

            let currentIndex = ''

            list.forEach(function (ele, index) {
                if (top > utils.getEleTop(ele) - 80) {
                    currentIndex = index
                }
            })

            if (detectItem === currentIndex) return
            detectItem = currentIndex
            document.querySelectorAll('.toc .active').forEach((i) => {
                i.classList.remove('active')
            })
            const activeitem = toc[detectItem]
            if (activeitem) {
                let parent = toc[detectItem].parentNode
                activeitem.classList.add('active')
                autoScroll(activeitem)
                for (; !parent.matches('.toc'); parent = parent.parentNode) {
                    if (parent.matches('li')) parent.classList.add('active')
                }
            }
        }
        window.tocScrollFn = utils.throttle(function () {
            const currentTop = window.scrollY || document.documentElement.scrollTop
            findHeadPosition(currentTop)
        }, 100)

        window.addEventListener('scroll', tocScrollFn)
    }
}
class B612 {
    static isDarkMode() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }
    static updateDarkModeSwitchButton() {
        const isDark = this.isDarkMode();
        const switchButtons = document.querySelectorAll('.darkmode_switchbutton i');
        switchButtons.forEach(button => {
            if (isDark) {
                button.classList.remove('fa-moon');
                button.classList.add('fa-sun');
            } else {
                button.classList.remove('fa-sun');
                button.classList.add('fa-moon');
            }
        });
    }
    static switchDarkMode() {
        if (this.isDarkMode()) {
            // 切换到浅色模式
            document.documentElement.setAttribute('data-theme', 'light')
            localStorage.setItem('theme', 'light')
            utils.snackbarShow(GLOBALCONFIG.lang.theme.light, false, 2000)
        } else {
            // 切换到暗黑模式
            document.documentElement.setAttribute('data-theme', 'dark')
            localStorage.setItem('theme', 'dark')
            utils.snackbarShow(GLOBALCONFIG.lang.theme.dark, false, 2000)
        }
        this.updateDarkModeSwitchButton();
    }
    static hideTodayCard() {
        document.getElementById('todayCard').classList.add('hide')
    }
    static toTop() {
        utils.scrollToDest(0)
    }
    static showConsole() {
        const el = document.getElementById('console')
        if (!el.classList.contains('show')) {
            el.classList.add('show')
        }
    }
    static hideConsole() {
        const el = document.getElementById('console')
        if (el.classList.contains('show')) {
            el.classList.remove('show')
        }
    }
    static copyPageUrl() {
        utils.copy(window.location.href)
    }
    static lightbox(el) {
        window.ViewImage && ViewImage.init(el);
    }
    static initTheme() {
        // 获取当前设备是否开启了暗黑模式
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // 获取用户之前设置的主题模式
        const cachedMode = localStorage.getItem('theme');
        const isLightMode = !isDarkMode;
        
        const nowMode =
          cachedMode && (cachedMode === 'dark' || cachedMode === 'light')
            ? cachedMode === 'dark' && isLightMode ? 'light'
            : cachedMode === 'light' && isDarkMode ? 'dark'
            : cachedMode
            : isDarkMode ? 'dark'
            : 'light';
        
        document.documentElement.setAttribute('data-theme', nowMode);
        localStorage.setItem('theme', nowMode);
        this.updateDarkModeSwitchButton();
    }
    static reflashEssayWaterFall() {
        if (document.getElementById('waterfall')) {
            setTimeout(function () {
                waterfall('#waterfall');
                document.getElementById("waterfall").classList.add('show');
            }, 500);
        }
    }
    static addRuntime() {
        const el = document.getElementById('runtimeshow')
        if (el && GLOBALCONFIG.runtime) {
            el.innerText = utils.timeDiff(new Date(GLOBALCONFIG.runtime), new Date()) + GLOBALCONFIG.lang.time.runtime
        }
    }
    static lazyloadImg() {
        window.lazyLoadInstance = new LazyLoad({
            elements_selector: 'img',
            threshold: 0,
            data_src: 'lazy-src',
            callback_error: (img) => {
                img.setAttribute("src", GLOBALCONFIG.lazyload.error);
            }
        })
    }
    static initbbtalk() {
        if (document.querySelector('#bber-talk')) {
            var swiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                loop: true,
                autoplay: {
                    delay: 3000,
                    pauseOnMouseEnter: true
                },
            });
        }
    }
    static musicToggle(){
        const $music = document.querySelector('#nav-music'),
        $meting = document.querySelector('meting-js'),
        $console = document.getElementById('consoleMusic')
        if (B612_musicPlaying) {
            $music.classList.remove("playing")
            $console.classList.remove("on")
            B612_musicPlaying = false;
            $meting.aplayer.pause();
        }else {
            $music.classList.add("playing")
            $console.classList.add("on")
            B612_musicPlaying = true;
            $meting.aplayer.play();
        }
    }
}

class hightlight {
    static createEle(langEl, item) {
        const fragment = document.createDocumentFragment()
        const highlightCopyEle = '<i class="fas fa-paste copy-button"></i>'

        const hlTools = document.createElement('div')
        hlTools.className = `highlight-tools`
        hlTools.innerHTML = langEl + highlightCopyEle
        hlTools.children[1].addEventListener('click', (e) => {
            utils.copy($table.querySelector('.code').innerText)
        })
        fragment.appendChild(hlTools)
        const itemHeight = item.clientHeight, $table = item.querySelector('table')
        if (GLOBALCONFIG.hightlight.limit && itemHeight > GLOBALCONFIG.hightlight.limit + 30) {
            $table.setAttribute('style', `height: ${GLOBALCONFIG.hightlight.limit}px`)
            const ele = document.createElement('div')
            ele.className = 'code-expand-btn'
            ele.innerHTML = '<i class="fas fa-angle-double-down"></i>'
            ele.addEventListener('click', (e) => {
                $table.setAttribute('style', `height: ${itemHeight}px`)
                e.target.className !== 'code-expand-btn' ? e.target.parentNode.classList.add('expand-done') : e.target.classList.add('expand-done')
            })
            fragment.appendChild(ele)
        }
        item.insertBefore(fragment, item.firstChild)
    }
    static init() {
        const $figureHighlight = document.querySelectorAll('figure.highlight'), that = this
        $figureHighlight.forEach(function (item) {
            let langName = item.getAttribute('class').split(' ')[1]
            if (langName === 'plaintext' || langName === undefined) langName = 'Code'
            const highlightLangEle = `<div class="code-lang">${langName.toUpperCase()}</div>`
            that.createEle(highlightLangEle, item)
        })
    }
}

class tabs {
    static init(){
        this.clickFnOfTabs()
        this.backToTop()
    }
    static clickFnOfTabs() {
        document.querySelectorAll('#article-container .tab > button').forEach(function (item) {
            item.addEventListener('click', function (e) {
                const that = this
                const $tabItem = that.parentNode
                if (!$tabItem.classList.contains('active')) {
                    const $tabContent = $tabItem.parentNode.nextElementSibling
                    const $siblings = utils.siblings($tabItem, '.active')[0]
                    $siblings && $siblings.classList.remove('active')
                    $tabItem.classList.add('active')
                    const tabId = that.getAttribute('data-href').replace('#', '')
                    const childList = [...$tabContent.children]
                    childList.forEach(item => {
                        if (item.id === tabId) item.classList.add('active')
                        else item.classList.remove('active')
                    })
                }
            })
        })
    }
    static backToTop() {
        document.querySelectorAll('#article-container .tabs .tab-to-top').forEach(function (item) {
            item.addEventListener('click', function () {
                utils.scrollToDest(utils.getEleTop(item.parentElement.parentElement.parentNode), 300)
            })
        })
    }
}


window.refreshFn = () => {
    scrollFn()
    sidebarFn()
    setTimeState()
    chageTimeFormate()
    B612.addRuntime()
    GLOBALCONFIG.lazyload.enable && B612.lazyloadImg()
    GLOBALCONFIG.lightbox && B612.lightbox('#article-container img, #bber .bber-content-img img, #album_detail album-content-img img')
    GLOBALCONFIG.randomlinks && randomLinksList()
    PAGECONFIG.toc && toc.init()
    if (PAGECONFIG.is_post || PAGECONFIG.is_page) {
        GLOBALCONFIG.hightlight.enable && hightlight.init()
        tabs.init()
    }
    PAGECONFIG.comment && initComment()
    if (PAGECONFIG.is_home) {
        showTodayCard()
        B612.initbbtalk()
    }
    if (PAGECONFIG.is_page && PAGECONFIG.page === 'says') B612.reflashEssayWaterFall()
    if (PAGECONFIG.is_page) {
        if (document.getElementById('album_detail')) B612.reflashEssayWaterFall()
    }
    GLOBALCONFIG.covercolor && coverColor()
}

B612.initTheme()
let B612_musicPlaying = false
document.addEventListener('DOMContentLoaded', function () {
    refreshFn()
})

document.addEventListener('pjax:complete', () => {
    window.refreshFn()
})