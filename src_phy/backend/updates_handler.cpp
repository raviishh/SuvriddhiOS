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
	system("./etc/init.d/update.sh");
    return 200;
}
