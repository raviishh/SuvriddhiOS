#include "updates_handler.h"
#include "json.hpp"
#include "constants.h"
#include <civetweb.h>
#include <cstdlib>
#include <string>
#include "utils.h"

using json = nlohmann::json;

int handle_update(struct mg_connection *conn, void *)
{
	int exit_code = system("./etc/init.d/update.sh");
    std::string error = "";
    switch (exit_code) {
        case 1: 
            error = "Download timed out (are you connected to the internet?)";
            break;
        case 2:
            error = "Download failed! (Are you connected to the internet?)";
            break;
        case 3:
            error = "Update failed to unpack!";
            break;
        case 4:
            error = "Failed to restart!";
            break;
        default:
            error = "Unknown error! Please try again.";
    }

    json res = { { "error", error } };
	send_response(conn, res.dump());
    return 500; // Since system() blocks the main thread the only way someone would get here is in an error state.
}
