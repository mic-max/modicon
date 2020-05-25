'use strict'

let browser = require('webextension-polyfill')

browser.runtime.onInstalled.addListener(async () => {
	let save = {}
	// dashboard
	addModToObj(save,
		'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGySURBVDhPjVM9T8JQFL23fJXyjQiIVZE4SoIjiYOLcXA0uriYmLiROPo73HR18CNGF/+AiZOzo5pAYiJOYDRKW1rvuy0UsSonOX3n3vd6+u7tewgOlg7qMiCskpTszEh4cQ0O62s0nNvRyDD7XzNMSyKK0ZvdIdp5qW+gd/+iBdmoHzYqaWaOdG/ONSDHX0kLEyEfzBcizDhpYSrmsLx3tQ8W5DEQUyE+XnX8+liuqCBRp5JBhLIa4dzJbRPumh+sRd014rquaVVdM0AwFfZDMaMw57IKzNKYjgSh00WmZtpliR1IumFSYHJjOEmslDKwsqAyaQ2T0q6mh84mAFjcvbSoBFIKQDzH26qU0qCO2dsVENMSvRSTfRxf37fh6c1gjZO1C8cgTJ3Kc9ITlljkIERr/X6WniV4Umy5TzfG9M6ZbS1KSEywnMrFIRGVWXuh0dLg9ZMaQMDY9qlrkLQNpnOJbwaN5xa03ztORBgoAeWtYzZAUMBKFTj5L2Qy8Dk9MLrmoyH6AOJ4Dp13hz/y9P/oFcEHxM0jan1gEZIzCDhwk8U9HWg8o5dDEkqEzrF08wUtUC8V0zjfWgAAAABJRU5ErkJggg==',
		['*_dashboards*', '*_analytics*', '*_wiki*']
	)
	// plan
	addModToObj(save,
		'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIxSURBVDhPlZO7a1NhGMafc3JpbmiapElKEzXGog6hUlHxgk6CS50UXPwHHFzqBdxc/AcER2cHoYOLg3XQRbQoFJRYHRQKba2XmkubNu85x+f9TtJTxAy+8OM83+V9vve7HOvsowdLsFDEf4bn4f7LK9eu2+K5RUnGIcO7fKgjiQQKB6ooVPcbxHWDcSUchsM8NbLNYCQEiQ35UFuRCJKZNJLZYYOZ0x9XbJi+wOBXA7Ky6kPdaPzGl/rCNmbO6o+AzuYOA0cwXirjVG3CoLrDvp9eALcJaa8HdLumr2fgIJPNolypGFQLByTOUvtoBa4DnWu+pt03gIf5D+8xO/vMoFo2WeLK9x7clnDFkA0ZCkMsmmubZr4B72PJ2cLn7rpBtQjLbrUhzRYnUpeLkNERSJ7VjRUgxRxvgk7GQMuJ0jnBq1RU90uORf0km6vrOXAxw1AU1t7SuSNvn4zpO4Cs7bgF1WqgK+fSvaR+sgvbsnCzdhLju7N5B95dv4KNDsvVkolqTYiwEttC1A7hdL68nXxn4gwOp3NoO10+Ju9imAbL3MpfT9kDrBDgepgsjGKaK2ZicUxmi6ik0rg99xzL0kEylcr4J/GPqL6ZqfEzr/pCfg+ulg6hKVu492kOXzda2s1fCPWBBvvezcDruq8oT2j7/EgZC601Jje12Qvr1kADjdLrxwd5di8o835PEEx8Ctub4m8xOBaPX/rowjtKHvLAvhGX1Hn6NwTO1OKxy/IHPxx8qsWHVq4AAAAASUVORK5CYII=',
		['*_workitems*', '*_backlogs*', '*_sprints*']
	)

	// NOTE: /db to download entire payload, /mods/<id> to download one group's mods
	const response = await fetch('https://my-json-server.typicode.com/mic-max/modicon/groups')
	const myJson = await response.json()
	console.log(JSON.stringify(myJson))
	// TODO: temporary fix to prevent reloads from maxing out storage quota
	// TODO: Investigate whether saving to storage with random keys is good practice
	//  Could the key be the actual image base64 string? size constraints?
	browser.storage.sync.clear(() => {
		browser.storage.sync.set(save, () => {
			// updateAllBookmarksAndTabs(mods)
		})
	})
})

function updateAllBookmarksAndTabs(mods) {
	for (const mod in mods) {
		reloadMatchingBookmarks(mod.regex)
		reloadMatchingTabs(mod.regex)
	}
}

browser.management.onUninstalled.addListener(() => {
	// getAllMods((mods) => {
	// 	updateAllBookmarksAndTabs(mods)
	// })
})

function reloadMatchingBookmarks(regex) {
	browser.bookmarks.getTree((res) => {
		const favBarId = res[0].children[0].id
		browser.bookmarks.getChildren(favBarId, (res) => {
			for (const bmark of res) {
				// Bookmarks have a url, folders do not.
				if (bmark.url) {
					if (regex.test(bmark.url)) {
						console.log('bookmark match:', bmark.url)
						browser.tabs.create({
							index: 0,
							active: false,
							pinned: true,
							url: bmark.url
						}, (tab) => {
							// Replace with a check for the tab being fully loaded
							setTimeout(() => {
								browser.tabs.remove(tab.id)
							}, 8000)
						})
					}
				} else {
					// TODO: recurse on this folder
				}
			}
		})
	})
}

function reloadMatchingTabs(regex) {
	browser.tabs.query({}, (tabs) => {
		for (const tab of tabs) {
			if (regex.test(tab.url)) {
				console.log('tab match:', tab.url)
				// TODO: Reloading tabs could be potentially bad for users, ex. in the middle of filling out a form
				browser.tabs.reload(tab.id, {
					bypassCache: true
				})
			}
		}
	})
}
