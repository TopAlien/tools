function isBrowseType (type) {
  return navigator.userAgent.indexOf(type) > -1
}

/**
  * 获取浏览器内核
  * @return Object
  */
function browse () {
  var $body, isChrome, isEdge
  var isMobile = false
  var result = {
    isNode: false,
    isMobile: isMobile,
    isPC: false
  }
  if (!staticWindow && typeof process !== staticStrUndefined) {
    result.isNode = true
  } else {
    $body = documenu.body || documenu.documentElement
    ['webkit', 'khtml', 'moz', 'ms', 'o'].forEach((core) => {
      result['-' + core] = !!$body[core + 'MatchesSelector']
    })
    
    isEdge = isBrowseType('Edge')
    isChrome = isBrowseType('Chrome')
    isMobile = /(Android|webOS|iPhone|iPad|iPod|SymbianOS|BlackBerry|Windows Phone)/.test(navigator.userAgent)
    assign(result, {
      edge: isEdge,
      firefox: isBrowseType('Firefox'),
      msie: !isEdge && result['-ms'],
      safari: !isChrome && !isEdge && isBrowseType('Safari'),
      isMobile: isMobile,
      isPC: !isMobile,
    })
  }
  return result
}

let browse = browse()

function createFrame () {
  const frame = document.createElement('iframe')
  frame.className = 'ealien--print-frame'
  return frame
}

const defaultHtmlStyle = ''
function createHtmlPage (opts, content) {
  const { style } = opts
  return [
    '<!DOCTYPE html><html>',
    '<head>',
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">',
    `<title>${opts.sheetName}</title>`,
    `<style>${defaultHtmlStyle}</style>`,
    style ? `<style>${style}</style>` : '',
    '</head>',
    `<body>${content}</body>`,
    '</html>'
  ].join('')
}

let printFrame = ''
function removePrintFrame () {
  if (printFrame) {
    if (printFrame.parentNode) {
      try {
        printFrame.contentDocument.write('')
      } catch (e) { }
      printFrame.parentNode.removeChild(printFrame)
    }
    printFrame = null
  }
}

function appendPrintFrame () {
  if (!printFrame.parentNode) {
    document.body.appendChild(printFrame)
  }
}

function afterPrintEvent () {
  requestAnimationFrame(removePrintFrame)
}

function getExportBlobByContent (content, options) {
  if (window.Blob) {
    return new Blob([content], { type: `text/${options.type};charset=utf-8;` })
  }
  return null
}

/** 核心思想 创建frame打印 */
export function handlePrint (opts, content) {
  const { beforePrintMethod } = opts
  if (beforePrintMethod) {
    content = beforePrintMethod({ content, options: opts }) || ''
  }
  content = createHtmlPage(opts, content)
  const blob = getExportBlobByContent(content, opts)
  if (browse.msie) {
    removePrintFrame()
    printFrame = createFrame()
    appendPrintFrame()
    printFrame.contentDocument.write(content)
    printFrame.contentDocument.execCommand('print')
  } else {
    if (!printFrame) {
      printFrame = createFrame()
      printFrame.onload = (evnt) => {
        if (evnt.target.src) {
          evnt.target.contentWindow.onafterprint = afterPrintEvent
          evnt.target.contentWindow.print()
        }
      }
    }
    appendPrintFrame()
    printFrame.src = URL.createObjectURL(blob)
  }
}
