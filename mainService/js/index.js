
var iframeOrigin = "*";

$("#matrixStart").click(function(){
    document.getElementById("ifr").contentWindow
        .postMessage("代码雨:", iframeOrigin);    
})

// 按钮调用iframe函数
function iframeFunc(func) {
    document.getElementById("ifr").contentWindow
        .postMessage((func + ":"), iframeOrigin);
}



//event 参数中有 data 属性，就是父窗口发送过来的数据
window.addEventListener("message", function (event) {
    // 把父窗口发送过来的数据显示在子窗口中    
    if (event.data.split(":")[0] == "爆破盒") {
        $("body").css({"background-color": "#36373c"});
        $(".bounce-wrap").css({"display": "block"});
        $("main").css({"z-index": 10})
        init();
        reset();
    } else if (event.data.split(":")[0] == "") {
        
    } 

}, false);

// 爆破盒
function init() {

	var emitter = document.getElementById("emitter"),
		container = document.createElement("div"),
		emitterSize = 100,
		dotQuantity = 50,
		dotSizeMax = 100,
		dotSizeMin = 10,
		speed = 1,
		gravity = 1;
	
	container.setAttribute("id", "emit-wrap");
	//setup the container with the appropriate styles
    container.style.cssText = "position:absolute; left:0; top:0; overflow:visible; z-index:5000; pointer-events:none;";
	document.body.appendChild(container);
	
	function createExplosion(container) {
		var tl = new TimelineLite({
			onComplete: function() {
				$('#emit-wrap').remove();
			}
		}),
			angle, length, dot, i, size;
		//create all the dots
		for (i = 0; i < dotQuantity; i++) {
			dot = document.createElement("div");
			dot.className = "emitter-dot";
			size = getRandom(dotSizeMin, dotSizeMax);
			container.appendChild(dot);
			angle = Math.random() * Math.PI * 2; //random angle
			//figure out the maximum distance from the center, factoring in the size of the dot (it must never go outside the circle), and then pick a random spot along that length where we'll plot the point. 
			length = Math.random() * (emitterSize / 2 - size / 2);
			//place the dot at a random spot within the emitter, and set its size.
			TweenLite.set(dot, {
				x: Math.cos(angle) * length,
				y: Math.sin(angle) * length,
				width: size,
				height: size,
				xPercent: -50,
				yPercent: -50,
				force3D: true
			});
			//this is where we do the animation...
			tl.to(dot, 1 + Math.random(), {
				opacity: 0,

				//if you'd rather not do physics, you could just animate out directly by using the following 2 lines instead of the physics2D:
				x: Math.cos(angle) * length * 24,
				y: Math.sin(angle) * length * 24
			}, 0);
		}
		return tl;
	}
	
	function explode(element) {
		var explosion = createExplosion(container);
		// var bounds = element.getBoundingClientRect();

		var offset = $(element).offset();
		var width = $(element).width();
		var height = $(element).height();

		// TweenLite.set(container, {
		//     x: bounds.left + bounds.width / 2,
		//     y: bounds.top + bounds.height / 2
		// });
		TweenLite.set(container, {
			x: offset.left + width / 2,
			y: offset.top + height / 2
		});
		explosion.restart();
	}

	function getRandom(min, max) {
		return min + Math.random() * (max - min);
	}
	
	emitter.onmousedown = emitter.ontouchstart = function() {
		explode(emitter);
		$(emitter).hide();

		$('.-shadow').hide();
		$('.js-box-wrap').hide();
		setTimeout(function(){
			$('.js-trigger-reset').css({
				'display': 'inline-block'
			});
		}, 2000);
		

		var tl = new TimelineMax();
		tl.add("logo")
		.add(logoReveal,"logo");
	}
}

function logoReveal() {
	var logoReveal = new TimelineMax();
             
    logoReveal.to('.js-icon-logo', 1, {autoAlpha: 1, ease: Power4.easeOut});

    setTimeout(function(){
        $("body").css({"background-color": "#fff"});
        $(".bounce-wrap").css({"display": "none"});
        $("main").css({"z-index": 0})
    }, 2000)

    return logoReveal;
}

function reset() {
	$('.-shadow').attr('style', '');
	$('.js-box-wrap').attr('style', '');
	$('.js-icon-logo').attr('style', '');
	$('#emitter').attr('style', '');
	$('.js-trigger-reset').hide();
}

