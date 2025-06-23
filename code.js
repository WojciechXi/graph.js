function Funkcja(data = {}) {
	let object = this;
	object.request = data.request;
	if (object.request == 'request') {
		return {
			response: 'response2',
		}
	} else {
		return {
			response: 'response',
		}
	}
}