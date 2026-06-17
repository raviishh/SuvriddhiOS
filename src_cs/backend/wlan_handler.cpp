#include "wlan_handler.h"
#include "json.hpp"
#include "constants.h"
#include <civetweb.h>
#include <cstdlib>
#include <string>
#include "utils.h"

using json = nlohmann::json;

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

    // 1. bring interface up
    if (system("ip link set wlan0 up") != 0) {
        return send_response(conn, json{{"success", false}, {"error", "Failed to bring wlan0 up"}}.dump()), 200;
    }

    // 2. generate config ONLY
    std::string gen_cmd =
        "wpa_passphrase '" + ssid + "' '" + passphrase + "' > /tmp/wpa_tmp.conf";

    if (system(gen_cmd.c_str()) != 0) {
        return send_response(conn, json{{"success", false}, {"error", "wpa_passphrase failed"}}.dump()), 200;
    }

    // 3. start supplicant separately
    std::string supp_cmd =
        "wpa_supplicant -B -i wlan0 -c /tmp/wpa_tmp.conf";

    if (system(supp_cmd.c_str()) != 0) {
        return send_response(conn, json{{"success", false}, {"error", "wpa_supplicant failed"}}.dump()), 200;
    }

    // 4. DHCP
    system("dhclient wlan0");

    // 5. internet check
    if (system("ping -c 1 -W 3 8.8.8.8 > /dev/null 2>&1") != 0) {
        return send_response(conn, json{{"success", false}, {"error", "Connected but no internet"}}.dump()), 200;
    }

    // 6. persist (only if fully successful)
    std::string save_cmd =
        "wpa_passphrase '" + ssid + "' '" + passphrase + "' >> /etc/wpa_supplicant.conf";

    system(save_cmd.c_str());
    system("ntpd -q -n");

    return send_response(conn, json{{"success", true}, {"error", ""}}.dump()), 200;
}
