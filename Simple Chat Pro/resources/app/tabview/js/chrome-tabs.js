const TAB_CONTENT_MARGIN = 9
  const TAB_CONTENT_OVERLAP_DISTANCE = 1

  const TAB_CONTENT_MIN_WIDTH = 24
  const TAB_CONTENT_MAX_WIDTH = 240

  const TAB_SIZE_SMALL = 84
  const TAB_SIZE_SMALLER = 60
  const TAB_SIZE_MINI = 48

  const tabTemplate = `
    <div class="chrome-tab">
      <div class="chrome-tab-dividers"></div>
      <div class="chrome-tab-background">
      </div>
      <div class="chrome-tab-content">
        <div class="chrome-tab-favicon"></div>
        <div class="chrome-tab-title"></div>
        <div class="chrome-tab-drag-handle"></div>
        <div class="chrome-tab-close"></div>
      </div>
    </div>
  `

  const defaultTapProperties = {
    title: 'New tab',
    favicon: false
  }

  let instanceId = 0

  class ChromeTabs {
    constructor() {}

    init(el) {
      this.el = el

      this.instanceId = instanceId
      this.el.setAttribute('data-chrome-tabs-instance-id', this.instanceId)
      instanceId += 1

      this.setupCustomProperties()
      this.setupStyleEl()
      this.setupEvents()
      this.layoutTabs()
    }

    emit(eventName, data) {
      this.el.dispatchEvent(new CustomEvent(eventName, { detail: data }))
    }

    setupCustomProperties() {
      this.el.style.setProperty('--tab-content-margin', `${ TAB_CONTENT_MARGIN }px`)
    }

    setupStyleEl() {
      this.styleEl = document.createElement('style')
      this.el.appendChild(this.styleEl)
    }

    setupEvents() {
      window.addEventListener('resize', _ => {
        this.cleanUpPreviouslyDraggedTabs()
        this.layoutTabs()
      })

      this.el.addEventListener('dblclick', event => {
        if ([this.el, this.tabContentEl].includes(event.target)) this.addTab()
      })

      this.tabEls.forEach((tabEl) => this.setTabCloseEventListener(tabEl))
    }

    get tabEls() {
      return Array.prototype.slice.call(this.el.querySelectorAll('.chrome-tab'))
    }

    get tabContentEl() {
      return this.el.querySelector('.chrome-tabs-content')
    }

    get tabContentWidths() {
      const numberOfTabs = this.tabEls.length
      const tabsContentWidth = this.tabContentEl.clientWidth
      const tabsCumulativeOverlappedWidth = (numberOfTabs - 1) * TAB_CONTENT_OVERLAP_DISTANCE
      const targetWidth = (tabsContentWidth - (2 * TAB_CONTENT_MARGIN) + tabsCumulativeOverlappedWidth) / numberOfTabs
      const clampedTargetWidth = Math.max(TAB_CONTENT_MIN_WIDTH, Math.min(TAB_CONTENT_MAX_WIDTH, targetWidth))
      const flooredClampedTargetWidth = Math.floor(clampedTargetWidth)
      const totalTabsWidthUsingTarget = (flooredClampedTargetWidth * numberOfTabs) + (2 * TAB_CONTENT_MARGIN) - tabsCumulativeOverlappedWidth
      const totalExtraWidthDueToFlooring = tabsContentWidth - totalTabsWidthUsingTarget

      const widths = []
      let extraWidthRemaining = totalExtraWidthDueToFlooring
      for (let i = 0; i < numberOfTabs; i += 1) {
        const extraWidth = flooredClampedTargetWidth < TAB_CONTENT_MAX_WIDTH && extraWidthRemaining > 0 ? 1 : 0
        widths.push(flooredClampedTargetWidth + extraWidth)
        if (extraWidthRemaining > 0) extraWidthRemaining -= 1
      }

      return widths
    }

    get tabContentPositions() {
      const positions = []
      const tabContentWidths = this.tabContentWidths

      let position = TAB_CONTENT_MARGIN
      tabContentWidths.forEach((width, i) => {
        const offset = i * TAB_CONTENT_OVERLAP_DISTANCE
        positions.push(position - offset)
        position += width
      })

      return positions
    }

    get tabPositions() {
      const positions = []

      this.tabContentPositions.forEach((contentPosition) => {
        positions.push(contentPosition - TAB_CONTENT_MARGIN)
      })

      return positions
    }

    layoutTabs() {
      const tabContentWidths = this.tabContentWidths

      this.tabEls.forEach((tabEl, i) => {
        const contentWidth = tabContentWidths[i]
        const width = contentWidth + (2 * TAB_CONTENT_MARGIN)

        tabEl.style.width = width + 'px'
        tabEl.removeAttribute('is-small')
        tabEl.removeAttribute('is-smaller')
        tabEl.removeAttribute('is-mini')

        if (contentWidth < TAB_SIZE_SMALL) tabEl.setAttribute('is-small', '')
        if (contentWidth < TAB_SIZE_SMALLER) tabEl.setAttribute('is-smaller', '')
        if (contentWidth < TAB_SIZE_MINI) tabEl.setAttribute('is-mini', '')
      })

      let styleHTML = ''
      this.tabPositions.forEach((position, i) => {
        styleHTML += `
          .chrome-tabs[data-chrome-tabs-instance-id="${ this.instanceId }"] .chrome-tab:nth-child(${ i + 1 }) {
            transform: translate3d(${ position }px, 0, 0)
          }
        `
      })
      this.styleEl.innerHTML = styleHTML
    }

    createNewTabEl() {
      const div = document.createElement('div')
      div.innerHTML = tabTemplate
      return div.firstElementChild
    }

    addTab(tabProperties, { animate = true, background = false } = {}) {
      let allTabUse = this.allTabEl;
      let check = 0;
      for (let i = 0; i < allTabUse.length; i++) {
        if (allTabUse[i].id === String(tabProperties.id)) {
           check = 1;
           break;
        } else {
          check = 0;
        }
      }
      if (check === 0) {
        const tabEl = this.createNewTabEl()
        const faviconEl = tabEl.querySelector('.chrome-tab-favicon')
        if (tabProperties.favicon) {
          faviconEl.style.backgroundImage = `url('${tabProperties.favicon}')`
          faviconEl.removeAttribute('hidden', '')
        } else {
          faviconEl.setAttribute('hidden', '')
          faviconEl.removeAttribute('style')
        }

        if (animate) {
          tabEl.classList.add('chrome-tab-was-just-added')
          setTimeout(() => tabEl.classList.remove('chrome-tab-was-just-added'), 500)
        }
        if (tabProperties.loadTab === 'load') {
          require("electron").ipcRenderer.send("setUserBrowser", tabProperties.user, tabProperties.id);
        }
        tabProperties = Object.assign({}, defaultTapProperties, tabProperties)
        this.tabContentEl.appendChild(tabEl)
        this.setTabCloseEventListener(tabEl, tabProperties)
        this.addClickAccount(tabEl, tabProperties)
        this.updateTab(tabEl, tabProperties)
        this.emit('tabAdd', {tabEl})
        if (!background) this.setCurrentTab(tabEl)
        this.cleanUpPreviouslyDraggedTabs()
        this.layoutTabs()
      } else {
        check = 0;
        alert('Tài khoản này đã tồn tại trong danh sách sử dụng');
      }

    }

    setTabCloseEventListener(tabEl, tabProperties) {
      tabEl.querySelector('.chrome-tab-close').addEventListener('click', () => {
        this.removeTab(tabEl, tabProperties);
      })
    }

    get activeTabEl() {
      return this.el.querySelector('.chrome-tab[active]')
    }

    get allTabEl() {
      return this.el.querySelectorAll('.chrome-tab')
    }

    getUserIdActive() {
      let id = this.el.querySelector('.chrome-tab[active]').id;
      require("electron").ipcRenderer.send("getTabActiveResult", id);
    }

    hasActiveTab() {
      return !!this.activeTabEl
    }

    setCurrentTab(tabEl) {
      const activeTabEl = this.activeTabEl;
      if (activeTabEl === tabEl) {
        return;
      }
      if (activeTabEl) activeTabEl.removeAttribute('active');
      tabEl.setAttribute('active', '');
      this.emit('activeTabChange', { tabEl });
    }


    setTabAfterRemove(tabProperties) {
      let ipc = require("electron").ipcRenderer;
      if (tabProperties.id === '' || tabProperties.id === undefined) {
        ipc.send("closeView");
      } else {
        ipc.send("ViewTab", tabProperties.id);
      }
    }

    setActiveTab(tabProperties) {
      document.getElementById(tabProperties.id).setAttribute('active','');
      document.getElementById('noti' + tabProperties.id).innerHTML = '';
    }

    setActiveTabFromNotification(tabProperties) {
      let allChromeTab = document.getElementsByClassName('chrome-tab');
      for (let i = 0; i < allChromeTab.length; i++) {
        allChromeTab[i].removeAttribute('active');
      }
      this.setActiveTab(tabProperties);
    }

    setNotiTab(tabProperties){
      const activeTabEl = this.activeTabEl;
      if (activeTabEl.id !== String(tabProperties.id)) {//chỉ hiện nút đỏ ở tab account đang không mở
        document.getElementById('noti' + tabProperties.id).innerHTML = '<img style="width: 10px; height: 10px; margin-top: 3px" src="circle-red.png"/>';
      }
    }

    removeTab(tabEl, tabProperties) {
      let ipc = require("electron").ipcRenderer;
      ipc.send("removeView", tabProperties.id);
      if (tabEl === this.activeTabEl) {
        if (tabEl.nextElementSibling) {
          this.setCurrentTab(tabEl.nextElementSibling)
        } else if (tabEl.previousElementSibling) {
          this.setCurrentTab(tabEl.previousElementSibling)
        }
      }
      tabEl.parentNode.removeChild(tabEl);
      this.emit('tabRemove', { tabEl })
      this.cleanUpPreviouslyDraggedTabs();
      this.layoutTabs();
    }

    updateTab(tabEl, tabProperties) {
      tabEl.querySelector('.chrome-tab-title').textContent = tabProperties.title
      let node = document.createElement('div');
      node.id = 'noti' + tabProperties.id;
      node.className = 'noti';
      tabEl.querySelector('.chrome-tab-content').appendChild(node);
      const faviconEl = tabEl.querySelector('.chrome-tab-favicon');
      if (tabProperties.favicon) {
        faviconEl.style.backgroundImage = `url('${ tabProperties.favicon }')`
        faviconEl.removeAttribute('hidden', '')
      } else {
        faviconEl.setAttribute('hidden', '')
        faviconEl.removeAttribute('style')
      }

      if (tabProperties.id) {
        tabEl.setAttribute('data-tab-id', tabProperties.id)
        tabEl.setAttribute('id',tabProperties.id)
      }

    }

    addClickAccount(tabEl, tabProperties) {
      tabEl.querySelector('.chrome-tab-content').addEventListener('click', () => this.chooseAccounts(tabEl, tabProperties))
    }

    chooseAccounts(tabEl, tabProperties) {
      this.setCurrentTab(tabEl);
      var ipc = require("electron").ipcRenderer;
      ipc.send("ViewTab", tabProperties.id);
    }

    cleanUpPreviouslyDraggedTabs() {
      this.tabEls.forEach((tabEl) => tabEl.classList.remove('chrome-tab-was-just-dragged'))
    }
  }
