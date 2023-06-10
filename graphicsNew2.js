class Graphics {
	constructor() {
		this.asciiTag = document.getElementById("asciiGraphics")
		this.canvasTag = document.getElementById("canvasGraphics")
		this.asciiTimer = undefined
		this.canvasTimer = undefined
		this.A = 1
		this.B = 1
		this.Radius1 = 1
		this.Radius2 = 2
		this.Scale1 = 150
		this.Scale2 = 5
		this.animateBtnASCII = null
		this.frames = 50
	}

	onLoad() {
		document
			.querySelector(".container_buttons_animateASCII")
			.addEventListener("click", () => this.animateAscii())
		document
			.querySelector(".container_buttons_animateCanvas")
			.addEventListener("click", () => this.animateCanvas())
		document
			.querySelector(".container_buttons_addFrame")
			.addEventListener("click", () => this.addFrames())
		document
			.querySelector(".container_buttons_removeFrame")
			.addEventListener("click", () => this.removeFrames())
	}

	addFrames() {
		this.frames += 50
		clearInterval(this.asciiTimer)
		this.asciiTimer = setInterval(() => this.asciiFrame(), this.frames)
		clearInterval(this.canvasTimer)
		this.canvasTimer = setInterval(() => this.canvasFrame(), this.frames)
	}
	removeFrames() {
		this.frames -= 50
		clearInterval(this.asciiTimer)
		this.asciiTimer = setInterval(() => this.asciiFrame(), this.frames)
		clearInterval(this.canvasTimer)
		this.canvasTimer = setInterval(() => this.canvasFrame(), this.frames)
	}

	asciiFrame() {
		let asciiArray = []
		let zBuffer = []
		this.A += 0.07
		this.B += 0.03
		let cosA = Math.cos(this.A)
		let sinA = Math.sin(this.A)
		let cosB = Math.cos(this.B)
		let sinB = Math.sin(this.B)
		for (let k = 0; k < 1760; k++) {
			asciiArray[k] = k % 80 == 79 ? "\n" : " "
			zBuffer[k] = 0
		}
		for (let theta = 0; theta < 6.28; theta += 0.07) {
			let cosTheta = Math.cos(theta)
			let sinTheta = Math.sin(theta)
			for (let phi = 0; phi < 6.28; phi += 0.02) {
				let sinPhi = Math.sin(phi)
				let cosPhi = Math.cos(phi)
				let h = cosTheta + 2
				let D = 1 / (sinPhi * h * sinA + sinTheta * cosA + 5)
				let t = sinPhi * h * cosA - sinTheta * sinA

				let x = 0 | (40 + 30 * D * (cosPhi * h * cosB - t * sinB))
				let y = 0 | (12 + 15 * D * (cosPhi * h * sinB + t * cosB))
				let o = x + 80 * y
				let N =
					0 |
					(8 *
						((sinTheta * sinA - sinPhi * cosTheta * cosA) * cosB -
							sinPhi * cosTheta * sinA -
							sinTheta * cosA -
							cosPhi * cosTheta * sinB))
				if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > zBuffer[o]) {
					zBuffer[o] = D
					asciiArray[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0]
				}
			}
		}
		this.asciiTag.innerHTML = asciiArray.join("")
	}

	updateCanvas() {}

	canvasFrame() {
		let ctx = this.canvasTag.getContext("2d")
		ctx.fillStyle = "#000"
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		if (this.canvasTimer === undefined) {
			this.A += 0.07
			this.B += 0.03
		}
		let cosA = Math.cos(this.A)
		let sinA = Math.sin(this.A)
		let cosB = Math.cos(this.B)
		let sinB = Math.sin(this.B)
		for (let theta = 0; theta < 6.28; theta += 0.3) {
			let cosTheta = Math.cos(theta)
			let sinTheta = Math.sin(theta)
			for (let phi = 0; phi < 6.28; phi += 0.1) {
				let sinPhi = Math.sin(phi)
				let cosPhi = Math.cos(phi)
				let ox = this.Radius2 + this.Radius1 * cosTheta
				let oy = this.Radius1 * sinTheta

				let x = ox * (cosB * cosPhi + sinA * sinB * sinPhi) - oy * cosA * sinB
				let y = ox * (sinB * cosPhi - sinA * cosB * sinPhi) + oy * cosA * cosB
				let ooz = 1 / (this.Scale2 + cosA * ox * sinPhi + sinA * oy)
				let xp = 150 + this.Scale1 * ooz * x
				let yp = 120 - this.Scale1 * ooz * y
				let L =
					0.7 *
					(cosPhi * cosTheta * sinB -
						cosA * cosTheta * sinPhi -
						sinA * sinTheta +
						cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi))
				if (L > 0) {
					ctx.fillStyle = "rgba(255,255,255," + L + ")"
					ctx.fillRect(xp, yp, 1.5, 1.5)
				}
			}
		}
	}

	animateAscii() {
		console.log(123)
		if (this.asciiTimer === undefined) {
			this.asciiTimer = setInterval(() => this.asciiFrame(), this.frames)
		} else {
			clearInterval(this.asciiTimer)
			this.asciiTimer = undefined
		}
	}

	animateCanvas() {
		if (this.canvasTimer === undefined) {
			this.canvasTimer = setInterval(() => this.canvasFrame(), this.frames)
		} else {
			clearInterval(this.canvasTimer)
			this.canvasTimer = undefined
		}
	}
}

const donut = new Graphics()

// if (document.getElementById) {
// window.attachEvent("onload", () => donut._onload())
window.addEventListener("load", () => donut.onLoad())
// } else {
// window.addEventListener("load", () => donut._onload(), false)
// }
