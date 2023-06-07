let pageIsLoaded = false
// let toggleBtn = null;
let windowWidth = null
class GraphicsMovement {
	initializeCode() {
		this.graphicsParagraph = document.getElementById("graphics")
		this.toggleBtn = document.querySelector(".container_toggleBtn")
		this.toggleBtn.addEventListener("click", () => this.animate())
		this.timer = null
		this.theta_sp = 0
		this.phi_sp = 0
	}
	renderFrame() {
		windowWidth = window.innerWidth
		this.b = []
		this.zBuffer = []
		this.theta_sp += 0.05
		this.phi_sp += 0.05
		// console.log(this.theta_sp)
		this.cosTheta_sp = Math.cos(this.theta_sp)
		this.sinTheta_sp = Math.sin(this.theta_sp)
		this.cosPhi_sp = Math.cos(this.phi_sp)
		this.sinPhi_sp = Math.sin(this.phi_sp)
		// console.log(this.sinPhi_sp)
		// console.log(this.phi_sp)

		for (let k = 0; k <= windowWidth; k++) {
			this.b[k] = k % 80 == 79 ? "\n" : " "
			this.zBuffer[k] = 0
		}
		for (let theta = 0; theta < 6.28; theta += 0.07) {
			this.cosTheta = Math.cos(theta)
			this.sinTheta = Math.sin(theta)
			//   console.log(theta)
			//   console.log(this.cosTheta)
			//   console.log(this.sinTheta)
		}
		for (let phi = 0; phi < 6.28; phi += 0.03) {
			this.cosPhi = Math.cos(phi)
			this.sinPhi = Math.sin(phi)
			this.circleX = this.cosTheta + 2
			this.z =
				this.sinPhi +
				this.circleX * this.theta_sp +
				this.sinTheta * this.cosTheta_sp +
				5
			this.D = 1 / this.z
			this.t =
				this.sinPhi * this.circleX * this.cosPhi_sp -
				this.sinTheta * this.sinTheta_sp
			this.x =
				0 |
				(40 +
					30 *
						this.D *
						(this.cosPhi * this.circleX * this.cosPhi_sp -
							this.t * this.sinPhi_sp))

			this.y =
				0 |
				(12 +
					15 *
						this.D *
						(this.cosPhi * this.circleX * this.sinPhi_sp +
							this.t * this.cosPhi_sp))

			this.o = this.x + 80 * this.y
			this.N =
				0 |
				(8 *
					((this.sinTheta * this.sinTheta_sp -
						this.sinPhi * this.cosTheta * this.cosPhi_sp) *
						this.cosPhi_sp -
						this.sinPhi_sp * this.cosTheta_sp * this.cosTheta -
						this.sinTheta * this.cosTheta_sp -
						this.cosPhi * this.cosTheta * this.sinTheta_sp))
			if (
				this.y < 22 &&
				this.y >= 0 &&
				this.x >= 0 &&
				this.x < 79 &&
				this.D > this.zBuffer[this.o]
			) {
				this.zBuffer[this.o] = this.D
				this.b[this.o] = "@@%%##**++==--::..  "[this.N > 0 ? this.N : 0]
			}
		}
		this.graphicsParagraph.innerHTML = this.b.join(" ")
		// this.graphicsParagraph.innerHTML = 123
	}
	animate() {
		if (this.timer === null) {
			console.log("animate true")
			this.timer = setInterval(() => this.renderFrame(), 50)
		} else {
			console.log("animate false")

			this.renderFrame()
			clearInterval(this.timer)
			this.timer = null
		}
	}
}
const moving = new GraphicsMovement()

window.addEventListener("load", moving.initializeCode())
