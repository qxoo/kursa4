// В объектно-ориентированном программировании класс – это расширяемый шаблон кода для создания объектов, который устанавливает в них начальные значения (свойства) и реализацию поведения (методы).
class graphicsMovement {
	onPageLoaded(){
		this.graphicsParagraph = document.getElementById("graphics");
		this.timer = null;
		this.theta_sp = 0;
		this.phi_sp = 0;
	}
}