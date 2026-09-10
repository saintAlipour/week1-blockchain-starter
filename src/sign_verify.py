from eth_keys import keys
import os

# Load private key from .env file
with open(".env", "r") as f:
    content = f.read()
    for line in content.splitlines():
        if line.startswith("PRIVATE_KEY="):
            private_key_hex = line.split("=", 1)[1].strip()
            if not private_key_hex.startswith("0x"):
                private_key_hex = "0x" + private_key_hex
            break

private_key = keys.PrivateKey(bytes.fromhex(private_key_hex[2:]))
public_key = private_key.public_key

# Original message
message = "Trade: BUY 1.5 BTC @ 92000"
message_bytes = message.encode("utf-8")

print(f"[+] Original message: {message}")

# Sign the message
signature = private_key.sign_msg(message_bytes)

print(f"\n[+] Signature (r, s, v):")
print(f"    r = {signature.r}")
print(f"    s = {signature.s}")
print(f"    v = {signature.v}")

# Verify with correct message
is_valid = public_key.verify_msg(message_bytes, signature)
print(f"\n[+] Verify with original message : {is_valid}")

# Verify with tampered message
tampered_message = "Trade: BUY 1.5 BTC @ 92001"
tampered_bytes = tampered_message.encode("utf-8")

is_valid_tampered = public_key.verify_msg(tampered_bytes, signature)
print(f"[+] Verify with tampered message : {is_valid_tampered}")