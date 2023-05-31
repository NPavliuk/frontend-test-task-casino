class Popup {
	constructor(popup, trigger) {
		this.popup = popup
		this.trigger = trigger
		this.triggerClose = this.popup.querySelector('.popup_close')

		document.addEventListener('click', (e) => {
			const isClosest = e.target.closest('.popup')

			if (!isClosest && this.popup.classList.contains('show') && e.target !== this.trigger) {
				this.closePopup()
			}
		})

		this.trigger.addEventListener('click', () => {
			this.clearPosition()
			this.setPosition()
			this.showPopup()
		})

		this.triggerClose.addEventListener('click', () => {
			this.closePopup()
		})
	}

	showPopup() {
		this.popup.classList.add('show')
		this.trigger.classList.add('active')
	}

	closePopup() {
		this.popup.classList.remove('show')
		this.trigger.classList.remove('active')
	}

	setPosition() {
		const triggerWidth = this.trigger.offsetWidth
		const popupWidth = 304
		const windowWidth = window.innerWidth

		const viewportOffsetTrigger = this.trigger.getBoundingClientRect()
		const triggerRight = viewportOffsetTrigger.right
		const triggerLeft = viewportOffsetTrigger.left

		const popupRight = (triggerRight - (triggerWidth / 2)) + (popupWidth / 2)
		const popupLeft = (triggerLeft + (triggerWidth / 2)) - (popupWidth / 2)

		switch (true) {
			case (popupLeft < 5):
				this.popup.classList.add('left')
				break
			case (windowWidth - popupRight < 5):
				this.popup.classList.add('right')
				break
			default:
				break
		}
	}

	clearPosition() {
		this.popup.classList.remove('left')
		this.popup.classList.remove('right')
	}
}

class ClipboardCopy {
	constructor(field, tooltip) {
		this.copyField = field
		this.tooltip = tooltip

		this.copyField.addEventListener('click', async () => {
			await this.copyCode()
		})
	}

	showTooltip() {
		this.tooltip.classList.add('show')

		setTimeout(() => {
			this.tooltip.classList.remove('show')
		}, 2000)
	}

	async copyCode() {
		try {
			await navigator.clipboard.writeText(this.copyField.innerText)
			this.showTooltip()
		} catch (error) {
			console.log('Not copied')
		}
	}
}

class ShowMore {
	constructor(list, button, selector) {
		this.list = list
		this.button = button
		this.items = this.list.querySelectorAll(`.${selector}`)

		const maxItems = 4
		const loadItems = 5

		if (this.items.length < maxItems + 1) {
			this.hideButton()
		}

		this.button.addEventListener('click', () => {
			const hiddenItems = this.getHiddenItems()

			hiddenItems.forEach((item, index) => {
				if (index < loadItems) {
					item.classList.add('show')
				}
			})

			const showedItems = this.list.querySelectorAll(`.${selector}.show`)

			if (showedItems.length === this.items.length) {
				this.hideButton()
			} else {
				const availableItems = this.items.length - showedItems.length

				if (availableItems < 5) {
					this.button.innerText = `Load More Casinos (+${availableItems})`
				}
			}
		})
	}

	getHiddenItems() {
		const hiddenItems = []

		this.items.forEach(item => {
			if (!item.classList.contains('show')) {
				hiddenItems.push(item)
			}
		})

		return hiddenItems
	}

	hideButton() {
		this.button.classList.add('hide')
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const bonusTags = document.querySelectorAll('.casino_bonuses-tag')

	if (bonusTags) {
		bonusTags.forEach(bonusTag => {
			const popupElement = bonusTag.querySelector('.popup')
			const popupTrigger = bonusTag.querySelector('.tag')

			if (popupTrigger && popupElement) {
				const popup = new Popup(popupElement, popupTrigger)
			}
		})
	}

	const copyElements = document.querySelectorAll('.copy')

	if (copyElements) {
		copyElements.forEach(copyElement => {
			const copyField = copyElement.querySelector('.copy_field')
			const toolTip = copyElement.querySelector('.tooltip')

			if (copyField && toolTip) {
				const clipboardCopy = new ClipboardCopy(copyField, toolTip)
			}
		})
	}

	const casinoList = document.querySelector('.casino-list')

	if (casinoList) {
		const casinoListButton = casinoList.querySelector('.casino-list_button')

		const showMoreCasino = new ShowMore(casinoList, casinoListButton, 'casino')
	}
})
