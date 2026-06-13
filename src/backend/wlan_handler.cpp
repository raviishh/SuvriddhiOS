#include "wlan_handler.h"
#include "json.hpp"
#include "constants.h"
#include <civetweb.h>
#include <cstdlib>
#include <string>
#include "utils.h"

using json = nlohmann::json;

int handle_wlan(struct mg_connection *conn, void *)
{
	char buf[8192];
	int req_bytes = mg_read(conn, buf, sizeof(buf));

	std::string body(buf, req_bytes);
	json req = json::parse(body);

	std::string ssid = req["ssid"];
	std::string passphrase = req["pass"];
	bool success = true;
	std::string error = "";

	system("ip link set wlan0 up");
	std::string wpa_cmd = "wpa_passphrase '" + ssid + "' '" + passphrase +
			      "' > /tmp/wpa_tmp.conf && wpa_supplicant -B -i wlan0 -c /tmp/wpa_tmp.conf";
	if (system(wpa_cmd.c_str()) != 0) {
		success = false;
		error = "WiFi connection failed";
	}
	if (success) {
		system("dhclient wlan0");
		if (system("ping -c 1 -W 3 8.8.8.8 > /dev/null 2>&1") != 0) {
			success = false;
			error = "Connected but no internet";
		}
	}
	if (success) {
		std::string save_cmd = "wpa_passphrase '" + ssid + "' '" + passphrase + "' >> /etc/wpa_supplicant.conf";
		system(save_cmd.c_str());
		system("ntpd -q -n");
	}

	json res = { { "success", success }, { "error", error } };
	send_response(conn, res.dump());
	return 200;
}
