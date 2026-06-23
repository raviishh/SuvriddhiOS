#include "wlan_handler.h"
#include "json.hpp"
#include "constants.h"
#include "utils.h"

#include <civetweb.h>
#include <cstdlib>
#include <string>

using json = nlohmann::json;

int handle_wlan(struct mg_connection *conn, void *)
{
    json req = GetJsonReq(struct mg_connection *conn);

    std::string ssid = req["ssid"];
    std::string passphrase = req["pass"];

    if (system("ip link set wlan0 up") != 0) {
        return send_response(conn,
            json{{"success", false}, {"error", "Failed to bring wlan0 up"}}.dump()), 200;
    }

    std::string gen_cmd =
        "wpa_passphrase '" + ssid + "' '" + passphrase + "' > /tmp/wpa_tmp.conf";
    if (system(gen_cmd.c_str()) != 0) {
        return send_response(conn,
            json{{"success", false}, {"error", "wpa_passphrase failed"}}.dump()), 200;
    }

    std::string supp_cmd =
        "wpa_supplicant -B -i wlan0 -c /tmp/wpa_tmp.conf";
    if (system(supp_cmd.c_str()) != 0) {
        return send_response(conn,
            json{{"success", false}, {"error", "wpa_supplicant failed"}}.dump()), 200;
    }

    system("udhcpc -i wlan0");
    if (system("ping -c 1 -W 3 8.8.8.8 > /dev/null 2>&1") != 0) {
        return send_response(conn,
            json{{"success", false}, {"error", "Connected but no internet"}}.dump()), 200;
    }

    std::string save_cmd =
        "wpa_passphrase '" + ssid + "' '" + passphrase + "' >> /etc/wpa_supplicant.conf";
    system(save_cmd.c_str());
    system("ntpd -g -q -p pool.ntp.org");
    return send_response(conn,
        json{{"success", true}, {"error", ""}}.dump()), 200;
}
