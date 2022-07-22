let CircleProgress = (function(selector, standartText, classPercentage) {
	let wrapper = document.querySelectorAll(selector);
	Array.prototype.forEach.call(wrapper, function(wrapper, i) {
		let wrapperWidth,
			wrapperHeight,
			percent,
			innerHTML,
			canvas,
			context,
			lineWidth,
			centerX,
			centerY,
			radius,
			newPercent,
			from,
			to,
			duration,
			start,
			text;

		let getValues = function() {
			wrapperWidth = parseInt(window.getComputedStyle(wrapper).width);
			wrapperHeight = wrapperWidth;
			percent = wrapper.getAttribute('data-cp-percentage');
			innerHTML = `<span class=${classPercentage}><strong>` + 
						percent + '</strong> %</span><canvas class="circleProgressCanvas" width="' + 
						(wrapperWidth * 2) + '" height="' + wrapperHeight * 2 + '"></canvas>';
			wrapper.innerHTML = innerHTML;
			text = standartText[i];
			canvas = document.getElementsByClassName('circleProgressCanvas')[i];
			wrapper.style.height = canvas.style.width = canvas.style.height = wrapperWidth + "px";
			context = canvas.getContext('2d');
			centerX = canvas.width / 2;
			centerY = canvas.height / 2;
			newPercent = 0;
			from = 0;
			to = percent;
			duration = 3000;
			lineWidth = 40;
			console.log(`Radius - ${radius}, width - ${canvas.width}`)
			radius = canvas.width / 2 - lineWidth;
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
				text.innerHTML = newPercent.toFixed(1);
				text.style.color = 'white';
				drawArc(newPercent);
			}
		}

		function drawArc(newPercent) {
			let circleStart = 1.5 * Math.PI;
			let circleEnd = circleStart + (newPercent / 2.5) * Math.PI;
			context.clearRect(0, 0, canvas.width, canvas.height);
			context.beginPath();
			context.arc(centerX, centerY, radius, circleStart, 4 * Math.PI, false);
			context.lineWidth = lineWidth;
			context.strokeStyle = 'transparent'; // #acd1e3
			context.stroke();
			context.beginPath();
			context.arc(centerX, centerY, radius, circleStart, circleEnd, false);
			context.lineWidth = lineWidth;
			context.strokeStyle = getColor((newPercent < 1) ? 0 : ((newPercent - 1) / 4));
			context.stroke();
		}

		let update = function() {
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

export default CircleProgress;