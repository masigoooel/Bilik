// Pengganti support.js untuk melihat file desain di browser (alat bantu dev, bukan bagian aplikasi).
// - nilai {{x}} diisi dari renderVals() / default di data-props
// - <sc-for list="{{arr}}" as="p"> diulang untuk tiap item
// - isi <helmet> dipindah ke <head>
;(function () {
  class DCLogic {
    constructor(props) {
      this.props = props
    }
  }
  window.DCLogic = DCLogic

  function get(obj, path) {
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
  }

  function fill(str, scope) {
    return str.replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (m, key) => {
      const v = get(scope, key)
      return v == null ? m : String(v)
    })
  }

  function expand(root, scope) {
    // sc-for paling dalam diproses lebih dulu lewat rekursi pada template
    const loops = [...root.querySelectorAll('sc-for')].filter((el) => !el.parentElement.closest('sc-for'))
    for (const loop of loops) {
      const listKey = (loop.getAttribute('list') || '').replace(/[{}\s]/g, '')
      const as = loop.getAttribute('as') || 'item'
      const list = get(scope, listKey) || []
      const tpl = loop.innerHTML
      const frag = document.createElement('div')
      frag.innerHTML = list
        .map((item) => {
          const holder = document.createElement('div')
          holder.innerHTML = tpl
          expand(holder, { ...scope, [as]: item })
          return fill(holder.innerHTML, { ...scope, [as]: item })
        })
        .join('')
      loop.replaceWith(...frag.childNodes)
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const script = document.querySelector('script[data-dc-script]')
    const dc = document.querySelector('x-dc')
    if (!script || !dc) return
    const meta = JSON.parse(script.getAttribute('data-props') || '{}')
    const defaults = {}
    for (const [k, v] of Object.entries(meta)) if (!k.startsWith('$') && v && 'default' in v) defaults[k] = v.default
    let vals = defaults
    try {
      const Component = new Function('DCLogic', `${script.textContent}; return Component;`)(DCLogic)
      vals = { ...defaults, ...new Component(defaults).renderVals() }
    } catch (e) {
      console.warn('renderVals gagal, pakai default', e)
    }
    const helmet = dc.querySelector('helmet')
    if (helmet) {
      document.head.insertAdjacentHTML('beforeend', helmet.innerHTML)
      helmet.remove()
    }
    expand(dc, vals)
    dc.innerHTML = fill(dc.innerHTML, vals)
    dc.style.display = 'block'
    document.documentElement.dataset.ready = '1'
  })
})()
