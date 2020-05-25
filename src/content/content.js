'use strict'

const currentUrl = window.location.href
getLinkRelIcon(currentUrl)

function getLinkRelIcon(pageUrl) {
    getImgHrefForUrl(pageUrl, (newIconHref) => {
        // Quit if there is no replacement icon for this page's URL
        if (!newIconHref)
            return

        const linkElements = Array.from(document.getElementsByTagName('link'))
            .filter(x => x.hasAttribute('rel'))

        if (linkElements.length > 0) {
            for (let linkEle of linkElements) {
                const rel = linkEle.getAttribute('rel').toLowerCase()
                if (rel === 'icon' || rel === 'shortcut icon') {
                    linkEle.setAttribute('type', 'image/png')
                    linkEle.setAttribute('href', prependBase64(newIconHref))
                }
            }
        } else {
            const headElements = document.getElementsByTagName('head')
            let headEle = null
            if (headElements.length === 0) {
                headEle = document.createElement('head')
                document.getElementsByTagName('html')[0].appendChild(headEle)
            } else {
                headEle = document.getElementsByTagName('head')[0]
            }

            let linkEle = document.createElement('link')
            linkEle.setAttribute('rel', 'icon')
            linkEle.setAttribute('type', 'image/png')
            linkEle.setAttribute('href', newIconHref)
            headEle.appendChild(linkEle)
        }
    })
}

function getImgHrefForUrl(url, cb) {
    browser.storage.sync.get(null, (items) => {
        for (const [guid, mod] of Object.entries(items)) {
            for (const wildcard of mod.wildcards) {
                if (wildcardToRegExp(wildcard).test(url))
                    return cb(mod.img)
            }
        }
        return cb(null)
    })
}
