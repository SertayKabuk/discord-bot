const axios = require('axios');

module.exports = {
	async httpGet(url) {
		try {
			return await axios.get(url);
		}
		catch (error) {
			console.error(error);
		}
	},
};