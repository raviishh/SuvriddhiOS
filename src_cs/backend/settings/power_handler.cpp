#include "power_handler.h"

#include <cstdlib>

using json = nlohmann::json;

int handle_power(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);
	std::string command = req["cmd"];
	if (command == "restart") {
		system("(sleep 2 && reboot) &");
	} else if (command == "shutdown") {
		system("(sleep 2 && poweroff) &");
	} else if (command == "sleep") {
		// TODO: add support for sleep at some point.
	}
	SendResponse(conn, "{}");
	return 200;
}
