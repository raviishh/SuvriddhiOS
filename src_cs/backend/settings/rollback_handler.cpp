#include "updates_handler.h"

#include <cstdlib>

int handle_rollback(struct mg_connection *conn, void *)
{
	system("mv /root/www.old /root/www_new");
	system("reboot");
	return 500; // Since system() blocks the main thread the only way someone would get here is in an error state.
}
