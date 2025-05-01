from samsungtvws import SamsungTVWS

# TV IP-címe és token fájl
tv_ip = "192.168.100.208"

# Kapcsolódás a TV-hez
tv = SamsungTVWS(host=tv_ip, port=8002, token="59426564")

# Hangerő növelése 1-gyel
tv.shortcuts().channel_down()
