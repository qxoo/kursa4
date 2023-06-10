let pretag = null
let canvastag = null
class Graphics {
	constructor() {
		pretag = document.getElementById("asciiGraphics")
		canvastag = document.getElementById("canvasGraphics")
		this.tmr1 = undefined
		this.tmr2 = undefined
		this.A = 1
		this.B = 1
		this.R1 = 1
		this.R2 = 2
		this.K1 = 150
		this.K2 = 5
	}

	asciiframe() {
		let b = []
		let z = []
		this.A += 0.07
		this.B += 0.03
		let cA = Math.cos(this.A)
		let sA = Math.sin(this.A)
		let cB = Math.cos(this.B)
		let sB = Math.sin(this.B)
		for (let k = 0; k < 1760; k++) {
			b[k] = k % 80 == 79 ? "\n" : " "
			z[k] = 0
		}
		for (let j = 0; j < 6.28; j += 0.07) {
			// j <=> theta
			let ct = Math.cos(j)
			let st = Math.sin(j)
			for (let i = 0; i < 6.28; i += 0.02) {
				// i <=> phi
				let sp = Math.sin(i)
				let cp = Math.cos(i)
				let h = ct + 2 // R1 + R2*cos(theta)
				let D = 1 / (sp * h * sA + st * cA + 5) // this is 1/z
				let t = sp * h * cA - st * sA // this is a clever factoring of some of the terms in x' and y'

				let x = 0 | (40 + 30 * D * (cp * h * cB - t * sB))
				let y = 0 | (12 + 15 * D * (cp * h * sB + t * cB))
				let o = x + 80 * y
				let N =
					0 |
					(8 *
						((st * sA - sp * ct * cA) * cB -
							sp * ct * sA -
							st * cA -
							cp * ct * sB))
				if (y < 22 && y >= 0 && x >= 0 && x < 79 && D > z[o]) {
					z[o] = D
					b[o] = ".,-~:;=!*#$@"[N > 0 ? N : 0]
				}
			}
		}
		pretag.innerHTML = b.join("")
	}

	canvasframe() {
		let ctx = canvastag.getContext("2d")
		ctx.fillStyle = "#000"
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

		if (this.tmr1 === undefined) {
			// only update A and B if the first animation isn't doing it already
			this.A += 0.07
			this.B += 0.03
		}
		// precompute cosines and sines of A, B, theta, phi, same as before
		let cA = Math.cos(this.A)
		let sA = Math.sin(this.A)
		let cB = Math.cos(this.B)
		let sB = Math.sin(this.B)
		for (let j = 0; j < 6.28; j += 0.3) {
			// j <=> theta
			let ct = Math.cos(j)
			let st = Math.sin(j) // cosine theta, sine theta
			for (let i = 0; i < 6.28; i += 0.1) {
				// i <=> phi
				let sp = Math.sin(i)
				let cp = Math.cos(i) // cosine phi, sine phi
				let ox = this.R2 + this.R1 * ct // object x, y = (R2,0,0) + (R1 cos theta, R1 sin theta, 0)
				let oy = this.R1 * st

				let x = ox * (cB * cp + sA * sB * sp) - oy * cA * sB // final 3D x coordinate
				let y = ox * (sB * cp - sA * cB * sp) + oy * cA * cB // final 3D y
				let ooz = 1 / (this.K2 + cA * ox * sp + sA * oy) // one over z
				let xp = 150 + this.K1 * ooz * x // x' = screen space coordinate, translated and scaled to fit our 320x240 canvas element
				let yp = 120 - this.K1 * ooz * y // y' (it's negative here because in our output, positive y goes down but in our 3D space, positive y goes up)
				// luminance, scaled back to 0 to 1
				let L =
					0.7 *
					(cp * ct * sB -
						cA * ct * sp -
						sA * st +
						cB * (cA * st - ct * sA * sp))
				if (L > 0) {
					ctx.fillStyle = "rgba(255,255,255," + L + ")"
					ctx.fillRect(xp, yp, 1.5, 1.5)
				}
			}
		}
	}

	anim1() {
		if (this.tmr1 === undefined) {
			this.tmr1 = setInterval(() => this.asciiframe(), 50)
		} else {
			clearInterval(this.tmr1)
			this.tmr1 = undefined
		}
	}

	anim2() {
		if (this.tmr2 === undefined) {
			this.tmr2 = setInterval(() => this.canvasframe(), 50)
		} else {
			clearInterval(this.tmr2)
			this.tmr2 = undefined
		}
	}
}

const graphic = new Graphics()

if (document.all) {
	window.attachEvent("onload", () => graphic._onload())
} else {
	window.addEventListener("load", () => graphic._onload(), false)
}
