#include "updates_handler.h"

#include <cstdlib>

using json = nlohmann::json;

int handle_update(struct mg_connection *conn, void *)
{
	int exit_code = system("/etc/init.d/update.sh &");
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
		error = "Update has successfully started! You may continue using suvriddhi OS and wait until the restart in ~10 minutes. If the restart doesn't happen, the system will update the next time SuvriddhiOS Reboots.";
	}

	json res = { { "error", error } };
	SendResponse(conn, res.dump());
	return 500; // Since system() blocks the main thread the only way someone would get here is in an error state.
}
