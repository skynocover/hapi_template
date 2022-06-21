import Hapi from "@hapi/hapi";
import Qs from "qs";

const add = (x, y) => {
  return x + y;
};

const server = Hapi.server({
  port: 3000,
  host: "0.0.0.0",
  query: {
    parser: (query) => Qs.parse(query),
  },
});

server.method({
  name: "add",
  method: add,
  options: {},
});

server.route({
  method: "GET",
  path: "/",
  handler: (request, h) => {
    return "Hello World!";
  },
});

// 轉址
server.route({
  method: "GET",
  path: "/back",
  handler: (r, h) => {
    return h.redirect("/");
  },
});

server.route({
  method: "GET",
  path: "/{any*}",
  handler: (r, h) => {
    return "<><h1>You Lost!<h1></>";
  },
});

server.route({
  method: "GET",
  path: "/hello/{user?}",
  handler: function (request, h) {
    const user = request.params.user ? request.params.user : "stranger";
    return `Hello ${user}! And name ${request.query.name}`;
  },
});

server.route({
  method: "GET",
  path: "/qs",
  handler: function (request, h) {
    return request.query;
  },
});

server.route({
  method: "POST",
  path: "/signup",
  handler: function (request, h) {
    const payload = request.payload;

    return `Welcome ${payload.username}!`;
  },
});

server.route({
  method: "GET",
  path: "/add",
  handler: (request, h) => {
    return server.methods.add(1, 2);
  },
});

const init = async () => {
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
