#include "power_handler.h"
#include "json.hpp"
#include "constants.h"
#include <civetweb.h>
#include <cstdlib>
#include <string>
#include "utils.h"

using json = nlohmann::json;

int handle_power(struct mg_connection *conn, void *)
{
	char buf[8192];
	int req_bytes = mg_read(conn, buf, sizeof(buf));

	std::string body(buf, req_bytes);
	json req = json::parse(body);

	std::string command = req["cmd"];

	if (command == "restart") {
		system("(sleep 2 && reboot) &");
	} else if (command == "shutdown") {
		system("(sleep 2 && poweroff) &");
	} else if (command == "sleep") {
		// TODO: add support for sleep at some point.
	}

	mg_printf(conn,
              "HTTP/1.1 200 OK\r\n"
              "Content-Type: application/json\r\n"
              "Connection: close\r\n\r\n"
              "{\"status\":\"rebooting\"}");

	return 200;
}
