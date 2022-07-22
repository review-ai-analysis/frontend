let SquareProgress = (function(selector, categories, classProgressBar, classProgressBlock, classActive) {
	let wrapper = document.querySelectorAll(selector);
	Array.prototype.forEach.call(wrapper, function(wrapper, i) {
		let percent,
			newPercent,
			from,
			to,
			duration,
			start,
			fullSquares,
			opacitySquare,
			progressBlocks;

		let getValues = function() {
			percent = categories[i][1] * 10;
			newPercent = 0;
			from = 0;
			to = percent;
			duration = 3000;
			start = new Date().getTime();
		};

		function getColor(value) {
			var hue = (value * 120).toString(10);
			return ["hsl(", hue, ",100%,50%)"].join("");
		}

		function animate() {
			requestAnimationFrame(animate);
			let time = new Date().getTime() - start;
			if (time <= duration) {
				let x = easeInOutQuart(time, from, to - from, duration);
				newPercent = x;
				drawSquares(newPercent);
			}
		}

		function drawSquares(newPercent) {
			progressBlocks = wrapper.getElementsByClassName(`${classProgressBlock}`);
			fullSquares = Math.trunc(newPercent / 10);
			opacitySquare = newPercent % 10 / 10;
			for (let i = 0; i < fullSquares; i++) {
				progressBlocks[i].style.opacity = 1;
				progressBlocks[i].setAttribute('class', `${classProgressBlock} ${classActive}`)
				progressBlocks[i].style.backgroundColor = `${getColor(newPercent / 100)}`
			}
			progressBlocks[fullSquares].setAttribute('class', `${classProgressBlock} ${classActive}`)
			progressBlocks[fullSquares].style.opacity = opacitySquare;
			progressBlocks[fullSquares].style.backgroundColor = `${getColor(newPercent / 100)}`
		}

		let update = function() {
			let progressBars = document.getElementsByClassName(`${classProgressBar}`)
			for (let i = 0; i < progressBars.length; i++) {
				for (let j = 0; j < progressBars[i].childNodes.length; j++) {
					let el = progressBars[i].childNodes[j]
					el.setAttribute('class', `${classProgressBlock}`)
					el.style.backgroundColor = `transparent`;
				}
			}
			getValues();
			animate();
		}
		update();
	});
	
	function easeInOutQuart(t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	}
});

export default SquareProgress;