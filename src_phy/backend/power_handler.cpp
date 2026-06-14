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
		system("reboot");
	} else if (command == "shutdown") {
		system("poweroff");
	} else if (command == "sleep") {
		system("echo mem > /sys/power/state");
	}

	return 200;
}
