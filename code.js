function Funkcja(data = {}) {
	let object = this;
	object.request = data.request;
	if (object.request == 'cipqa') {
		return {
			response: object.request,
		}
	} else {
		object.request = 'cipqa';
		return {
			response: object.request,
		}
	}
}