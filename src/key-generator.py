from eth_keys import keys
import os

private_key_bytes = os.urandom(32)
private_key = keys.PrivateKey(private_key_bytes)
public_key = private_key.public_key
address = public_key.to_checksum_address()

print("=" * 60)
print(f"Private Key (Hex): {private_key.to_hex()}")
print(f"Public Key  (Hex): {public_key.to_hex()}")
print(f"Ethereum Address : {address}")
print("=" * 60)

with open(".env", "w") as f:
    f.write(f"PRIVATE_KEY={private_key.to_hex()}\n")

