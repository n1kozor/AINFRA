from samsungtvws import SamsungTVWS

# TV IP-címe és token fájl
tv_ip = "192.168.100.208"
token_file = "tv-token.txt"

# Kapcsolódás a TV-hez
tv = SamsungTVWS(host=tv_ip, port=8002, token_file=token_file)

# Hangerő növelése 1-gyel
tv.shortcuts().volume_up()
