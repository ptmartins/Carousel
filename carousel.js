(function(Carousel) {

	var carousel = document.getElementById('carousel');
		slides = '',
		navPrev = '',
		navNext = '',
		dotsNav = '',
		dots = '',
		counter = 0,
		currentSlide = '',
	
		settings = {
			autoTransition: false,
			autoTiming: 3000,
			dots: true,
			keyboard: true,
			slideTransition: 'fade',
			slides: [
				{
					src: 'https://res.cloudinary.com/snitramordep/image/upload/v1546861938/azores-grass-lagoon-of-fire-121087.jpg', 
					caption: ''
				},
				{
					src: 'https://res.cloudinary.com/snitramordep/image/upload/v1546861901/architecture-bridge-city-415947.jpg', 
					caption: ''
				},
				{
					src: 'https://res.cloudinary.com/snitramordep/image/upload/v1546861849/architecture-building-exterior-buildings-1389339.jpg', 
					caption: ''
				},
				{
					src: 'https://res.cloudinary.com/snitramordep/image/upload/v1546861939/maxime-daguet-148467-unsplash.jpg', 
					caption: ''
				},
				{
					src: 'https://res.cloudinary.com/snitramordep/image/upload/v1546861938/bagus-ghufron-42002-unsplash.jpg', 
					caption: ''
				},
			]
		},	

		/**
		* Check DOM for existidotsNav = null,ng ID to attach carousel
		*/
		checkDOM = function() {
		 	if(!document.getElementById('carousel')) {
				return false;
			} else {
				document.getElementById('carousel').className = 'carousel';
				return true;
			}
		},


		/**
		* Merge provided object (if any), with carousel defaults
		*/
		mergeDefaults = function(obj) {
			Object.keys(obj).forEach(function(key){
				if(obj.hasOwnProperty(key)) {
					settings[key] = obj[key]; 
				}
			}); 			var currentDot = document.querySelector('.dotNav.active');
		},	


		/**
		* Builds carousel inner markup
		*/
		buildCarousel = function() {
			var fragment = document.createDocumentFragment();
			var list = document.createElement('UL');
			navPrev = document.createElement('SPAN');
			navNext = document.createElement('SPAN');

			list.className = 'carousel-track';
			navPrev.className = 'nav nav-prev fas fa-angle-left';
			navPrev.dataset.goto = -1;
			navNext.className = 'nav nav-next fas fa-angle-right';
			navNext.dataset.goto = 1;

			if(settings.dots) {
				dotsNav = document.createElement('DIV');
				dotsNav.className = 'dotsNav';
			}

			for(var i = 0; i < settings.slides.length; i++) {
				var item = document.createElement('LI');
				item.className = 'carousel-slide';
				var image = document.createElement('IMG');
				image.className = 'slide-image';
				image.setAttribute('src', settings.slides[i].src);
				item.appendChild(image);

				if(i === 0) {
					item.classList.add('active');
				}
				
				// Append dots navigation
				if(settings.dots) {
					var dot = document.createElement('SPAN');
					dot.className = 'nav dotNav';
					dot.dataset.slide = i;
					dot.setAttribute('title', 'Slide' + (i + 1));
					dotsNav.appendChild(dot);
					if( i === 0) {
						dot.classList.add('active');
					}
				}

				// Append caption to slide
				if(settings.slides[i].caption) {
					carousel.classList.add('hasCaptions');
					var text = settings.slides[i].caption;
					var caption = document.createElement('DIV');
					caption.className = 'caption';
					caption.innerHTML = text;

					item.appendChild(caption);
				} 

				list.appendChild(item);
			}

			fragment.appendChild(navPrev);
			fragment.appendChild(list);
			fragment.appendChild(navNext);
			if(settings.dots) {
				carousel.style.paddingBottom = '3rem';
				fragment.appendChild(dotsNav);
			}
			carousel.appendChild(fragment);
			slides = document.getElementsByClassName('carousel-slide');
			dots = document.getElementsByClassName('dotNav');
			currentSlide = document.querySelector('.carousel-slide.active');


			if(settings.autoTransition) {
				carousel.classList.add('auto');

				setInterval(function() {
					clearCurrent();
					counter += 1;
					counter = counter > slides.length - 1 ? 0 : counter;
					slides[counter].classList.add('active');
					updateCurrent(counter);			
				}, settings.autoTiming);
			}

			if(settings.slideTransition) {
				carousel.classList.add(settings.slideTransition);
			}

			attachEvents();
		 },


		/**
		 * Attaches DOM events
		 */
		attachEvents = function() {
			var dots = document.getElementsByClassName('dotNav');

			navPrev.addEventListener('click', goToSlide);
			navNext.addEventListener('click', goToSlide);

			for(var i = 0; i < dots.length; i++) {
				dots[i].addEventListener('click', showSlide);
			}

			if(settings.keyboard) {
				document.addEventListener('keydown', function(ev) {
					if(ev.keyCode === 37) {
						clearCurrent();
						counter -= 1;
						counter = counter < 0 ? slides.length - 1 : counter;
						slides[counter].classList.add('active');
						updateCurrent(counter);
					} else if(ev.keyCode === 39) {
						clearCurrent();
						counter += 1;
						counter = counter > slides.length - 1 ? 0 : counter;
						slides[counter].classList.add('active');
						updateCurrent(counter);
					}
				});
			}
		},


		/**
		 * Clears all active slides and navigation dots
		 */
		clearCurrent = function() {
			var currentSlide = document.querySelector('.carousel-slide.active');
			currentSlide.classList.remove('active');

			if(settings.dots) {
				var currentDot = document.querySelector('.dotNav.active');
				currentDot.classList.remove('active');
			}
		},


		updateCurrent = function(n) {
			slides[n].classList.add('active');
			dots[n].classList.add('active');
		},


		/**
		 * Goes to next or previous slide when cliking navigation arrows 
		 */
		goToSlide = function(ev) {
			var target = ev.target;
			clearCurrent();
			
			if(target.dataset.goto === '1') {
				counter += 1;
				if(counter >= slides.length) {
					counter = 0;
				}
			}
			else if(target.dataset.goto === '-1') {
				counter += -1;
				if(counter < 0) {
					counter = slides.length - 1;
				}
			}

			currentSlide = slides[counter];
			updateCurrent(counter);
		},


		/**
		 * Shows slide when clicking dot navigation
		 */
		showSlide = function(ev) {
			var target = ev.target;

			clearCurrent();
			
			for(var i = 0; i < slides.length; i++) {
				if(i === Number.parseInt(target.dataset.slide)) {
					currentSlide = slides[i];
					counter = i;
					updateCurrent(counter);
				}
			}
		}

		/**
		 * Trigger function
		 */
		init = function(obj) {

			var a = obj || {};

			if(checkDOM()) {
				if (Object.keys(a) !== []) {
					mergeDefaults(a);
				}
				buildCarousel();
			}
		};


	Carousel.init = init;

})(window.Carousel = window.Carousel || {})

Carousel.init();