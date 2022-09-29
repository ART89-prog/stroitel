$(() => {
	// Ширина окна для ресайза
	WW = $(window).width()


	// О выставке
	if ($('.about_info .swiper').length) {
		new Swiper('.about_info .swiper', {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			slidesPerView: 1,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			preloadImages: false,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			breakpoints: {
				0: {
					spaceBetween: 8
				},
				768: {
					spaceBetween: 20
				}
			}
		})
	}


	// Партнеры
	const partnersSliders = []

	$('.partners .swiper').each(function (i) {
		$(this).addClass('partners_s' + i)

		let options = {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			preloadImages: false,
			speed: 5000,
			autoplay: {
				delay: 0
			},
			centeredSlides: true,
			allowTouchMove: false,
			disableOnInteraction: true,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			breakpoints: {
				0: {
					spaceBetween: 8,
					slidesPerView: 2
				},
				768: {
					spaceBetween: 20,
					slidesPerView: 3
				},
				1024: {
					spaceBetween: 20,
					slidesPerView: 4
				}
			}
		}

		partnersSliders.push(new Swiper('.partners_s' + i, options))
	})


	// Отзывы
	const reviewsSliders = []

	$('.reviews .swiper').each(function (i) {
		$(this).addClass('reviews_s' + i)

		let options = {
			loop: true,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			},
			preloadImages: false,
			lazy: {
				enabled: true,
				checkInView: true,
				loadOnTransitionStart: true,
				loadPrevNext: true
			},
			breakpoints: {
				0: {
					spaceBetween: 8,
					slidesPerView: 1
				},
				768: {
					spaceBetween: 20,
					slidesPerView: 2
				},
				1024: {
					spaceBetween: 20,
					slidesPerView: 3
				}
			},
			on: {
				init: swiper => setHeight($(swiper.$el).find('.review')),
				resize: swiper => {
					$(swiper.$el).find('.review').height('auto')
					setHeight($(swiper.$el).find('.review'))
				}
			}
		}

		reviewsSliders.push(new Swiper('.reviews_s' + i, options))
	})


	// Мини всплывающие окна
	$('.mini_modal_btn').click(function(e) {
		e.preventDefault()

		const modalId = $(this).data('modal-id')

		if ($(this).hasClass('active')) {
			$(this).removeClass('active')
			$('.mini_modal').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		} else {
			$('.mini_modal_btn').removeClass('active')
			$(this).addClass('active')

			$('.mini_modal').removeClass('active')
			$(modalId).addClass('active')

			if (is_touch_device()) $('body').css('cursor', 'pointer')
		}
	})

	// Закрываем всплывашку при клике за её пределами
	$(document).click(e => {
		if ($(e.target).closest('.modal_cont').length === 0) {
			$('.mini_modal, .mini_modal_btn').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		}
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: "Закрыть",
		NEXT: "Следующий",
		PREV: "Предыдущий",
		MODAL: "Вы можете закрыть это модальное окно нажав клавишу ESC"
	}

	Fancybox.defaults.template = {
		closeButton: '<svg><use xlink:href="images/sprite.svg#ic_close"></use></svg>',
		spinner: '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="25 25 50 50" tabindex="-1"><circle cx="50" cy="50" r="20"/></svg>',
		main: null
	}

	// Всплывающие окна
	$('body').on('click', '.modal_btn', function (e) {
		e.preventDefault()

		Fancybox.close()

		Fancybox.show([{
			src: $(this).data('modal'),
			type: 'inline'
		}])
	})


	// Моб. меню
	$('header .mob_menu_btn, .overlay').click((e) => {
		e.preventDefault()

		$('header .mob_menu_btn').toggleClass('active')
		$('body').toggleClass('menu_open')
		$('.mob_menu').toggleClass('show')

		$('header .mob_menu_btn').hasClass('active')
			? $('.overlay').fadeIn(300)
			: $('.overlay').fadeOut(200)
	})


	if (is_touch_device()) {
		// Подменю на тач скрине
		$('header .menu_item > a.sub_link').addClass('touch_link')

		$('header .menu_item > a.sub_link').click(function (e) {
			const $dropdown = $(this).next()

			if ($dropdown.css('visibility') === 'hidden') {
				e.preventDefault()

				$('header .menu .sub_menu').removeClass('show')
				$dropdown.addClass('show')

				$('body').css('cursor', 'pointer')
			}
		})

		// Закрываем под. меню при клике за её пределами
		$(document).click((e) => {
			if ($(e.target).closest('.menu').length === 0) {
				$('header .menu .sub_menu').removeClass('show')

				$('body').css('cursor', 'default')
			}
		})


		// Закрытие моб. меню свайпом справо на лево
		let ts

		$('body').on('touchstart', (e) => { ts = e.originalEvent.touches[0].clientX })

		$('body').on('touchend', (e) => {
			let te = e.originalEvent.changedTouches[0].clientX

			if ($('body').hasClass('menu_open') && ts > te + 50) {
				// Свайп справо на лево
				$('header .mob_menu_btn').removeClass('active')
				$('body').removeClass('menu_open')
				$('.mob_menu').removeClass('show')
				$('.overlay').fadeOut(200)
			} else if (ts < te - 50) {
				// Свайп слева на право
			}
		})
	}
})



$(window).on('resize', () => {
	if (typeof WW !== 'undefined' && WW != $(window).width()) {
		// Моб. версия
		if (!firstResize) {
			$('meta[name=viewport]').attr('content', 'width=device-width, initial-scale=1, maximum-scale=1')
			if ($(window).width() < 375) $('meta[name=viewport]').attr('content', 'width=375, user-scalable=no')

			firstResize = true
		} else {
			firstResize = false
		}


		// Перезапись ширины окна
		WW = $(window).width()
	}
})