<territory>
    <div id="territory" />
    <div id="script" />
    <script type="text/javascript">
        this.on('mount', () => {
            const inst = new Territory()
            inst.trigger('init', opts.args.join('/'))
            let container = Z.qs('#territory')
            if (!container) return
            container.innerHTML = ''
            container.dataset.udataTerritory = opts.args.join('-')
            let scriptContainer = Z.qs('#script')
            scriptContainer.innerHTML = ''
            const script = Z.el('script', {id: 'udata', src: `${API_URLS.UDATA}static/widgets.js`}, scriptContainer)
        })
    </script>
</territory>
