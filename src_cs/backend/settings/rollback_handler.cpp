#include "updates_handler.h"

#include <cstdlib>

int handle_rollback(struct mg_connection *conn, void *)
{
	system("mv /root/www.old /root/www_new &");
	system("(/etc/init.d/S60cage stop && sleep 1 && reboot) > /dev/null 2>&1 &");
	return 500; // Since system() blocks the main thread the only way someone would get here is in an error state.
}
