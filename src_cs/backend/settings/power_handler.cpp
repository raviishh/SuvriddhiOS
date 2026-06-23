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
	json req = GetJsonReq(struct mg_connection *conn);
	std::string command = req["cmd"];
	if (command == "restart") {
		system("(sleep 2 && reboot) &");
	} else if (command == "shutdown") {
		system("(sleep 2 && poweroff) &");
	} else if (command == "sleep") {
		// TODO: add support for sleep at some point.
	}
	send_response(conn, "{}");
	return 200;
}
