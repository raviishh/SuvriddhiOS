#include "power_handler.h"
#include <cstdlib>
#include <iostream>
using json = nlohmann::json;
int handle_power(struct mg_connection *conn, void *)
{
	json req = GetJsonReq(conn);
	std::string command = req["cmd"];
	if (command == "restart") {
		int ret = system("(/etc/init.d/S60cage stop && sleep 1 && reboot) > /dev/null 2>&1 &");
		std::cerr << "system(\"reboot\") returned: " << ret << std::endl;
	} else if (command == "shutdown") {
		int ret = system("(/etc/init.d/S60cage stop && sleep 1 && poweroff) > /dev/null 2>&1 &");
		std::cerr << "system(\"poweroff\") returned: " << ret << std::endl;
	} else if (command == "sleep") {
		// TODO: add support for sleep at some point.
	}
	SendResponse(conn, "{}");
	return 200;
}
