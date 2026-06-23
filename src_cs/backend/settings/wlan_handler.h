#ifndef WLAN_HANDLER_H
#define WLAN_HANDLER_H

#include <civetweb.h>

int handle_wlan(struct mg_connection *conn, void *);

#endif // WLAN_HANDLER_H
