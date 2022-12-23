const http = require("http");

const server = http.createServer((req, res) => {
	console.log(req.method);
	console.log("Hello world");
});

server.listen("5000", () =>
	console.log("server running on port http://localhost:5000")
);
