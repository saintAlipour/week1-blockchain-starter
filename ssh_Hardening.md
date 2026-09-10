# SSH Hardening Checklist

**Author:** [mohamad alipour]
**Date:** 2026
**Purpose:** Security hardening guide for SSH servers (Linux)

---

## Overview / مرور کلی

This document provides a checklist of 5 essential SSH security settings that should be applied to any Linux server exposed to the internet. Each item includes the **Before** (default/insecure) and **After** (hardened/secure) configuration, along with an explanation of why the change matters.

این سند شامل چک‌لیست ۵ تنظیم امنیتی ضروری SSH است که باید روی هر سرور لینوکسی که به اینترنت متصل است اعمال شود. هر مورد شامل **Before** (پیش‌فرض/ناامن) و **After** (امن‌شده) به همراه توضیح دلیل اهمیت تغییر است.

**Config file location / محل فایل کانفیگ:**
```
/etc/ssh/sshd_config
```

---

## 1. Disable Root Login

**Goal / هدف:** Prevent direct login as `root` over SSH.
جلوگیری از ورود مستقیم با کاربر `root` از طریق SSH.

**Before:**
```
#PermitRootLogin prohibit-password
```

**After:**
```
PermitRootLogin no
```

**Why it matters / چرا مهم است:**
- `root` is the most targeted account by attackers.
- Every server has a `root` user by default, so attackers already know the username.
- Disabling root login forces admins to log in as a regular user and use `sudo` for privileged tasks.

- حساب `root` بیشترین هدف حملات است.
- هر سروری به صورت پیش‌فرض کاربر `root` دارد، پس مهاجم نام کاربری را می‌داند.
- با غیرفعال کردن ورود root، ادمین باید ابتدا با کاربر معمولی وارد شود و برای کارهای مدیریتی از `sudo` استفاده کند.

---

## 2. Disable Password Authentication (Key Auth Only)

**Goal / هدف:** Allow only SSH key authentication, disable passwords.
فقط اجازه ورود با کلید SSH، غیرفعال کردن پسورد.

**Before:**
```
#PasswordAuthentication yes
#PubkeyAuthentication yes
```

**After:**
```
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
```

**Why it matters / چرا مهم است:**
- Passwords can be guessed, leaked, reused, or brute-forced.
- SSH keys are cryptographically strong (typically 2048–4096 bits).
- This also protects against credential-stuffing attacks.

- پسوردها قابل حدس زدن، لو رفتن، تکرار شدن یا brute-force هستند.
- کلیدهای SSH از نظر رمزنگاری بسیار قوی هستند (معمولاً ۲۰۴۸ تا ۴۰۹۶ بیت).
- این تنظیم همچنین از حملات credential-stuffing جلوگیری می‌کند.

---

## 3. Change Default SSH Port

**Goal / هدف:** Move SSH from the default port `22` to a custom port.
تغییر پورت پیش‌فرض SSH از `22` به یک پورت دلخواه.

**Before:**
```
#Port 22
```

**After:**
```
Port 2222
```

**Why it matters / چرا مهم است:**
- Most automated scanners and botnets only target port 22.
- Changing the port drastically reduces the volume of background noise and automated attacks.
- This is **security by obscurity** — not a replacement for real security, but a useful addition.

- بیشتر اسکنرهای خودکار و بات‌نت‌ها فقط پورت ۲۲ را هدف می‌گیرند.
- تغییر پورت، حجم حملات خودکار و نویز پس‌زمینه را به شدت کاهش می‌دهد.
- این روش **security by obscurity** است — جایگزین امنیت واقعی نیست، اما مکمل مفیدی است.

> **Note / نکته:** Make sure your firewall (e.g., `ufw`, `iptables`) allows the new port **before** restarting SSH.
> قبل از ری‌استارت SSH، مطمئن شو فایروال (مثلاً `ufw` یا `iptables`) پورت جدید را باز می‌کند.

---

## 4. Limit Authentication Attempts (MaxAuthTries)

**Goal / هدف:** Limit the number of failed login attempts per connection.
محدود کردن تعداد تلاش‌های ناموفق ورود در هر اتصال.

**Before:**
```
#MaxAuthTries 6
```

**After:**
```
MaxAuthTries 3
```

**Why it matters / چرا مهم است:**
- Default is 6 attempts, which gives attackers more chances.
- Reducing to 3 makes brute-force attacks significantly harder.
- After the limit is reached, the connection is dropped and logged.

- مقدار پیش‌فرض ۶ تلاش است که به مهاجم فرصت بیشتری می‌دهد.
- کاهش به ۳، حملات brute-force را بسیار سخت‌تر می‌کند.
- پس از رسیدن به حد مجاز، اتصال قطع شده و در لاگ ثبت می‌شود.

---

## 5. Set ClientAliveInterval (Idle Timeout)

**Goal / هدف:** Automatically disconnect idle SSH sessions.
قطع خودکار نشست‌های SSH بی‌کار.

**Before:**
```
#ClientAliveInterval 0
#ClientAliveCountMax 3
```

*

*After:**
```
ClientAliveInterval 300
ClientAliveCountMax 2
```

**Why it matters / چرا مهم است:**
- If a session is left open and unattended, anyone with physical or remote access can hijack it.
- The server sends a keep-alive probe every 300 seconds (5 minutes).
- If the client doesn't respond to 2 consecutive probes (10 minutes total), the session is terminated.

- اگر یک نشست باز و بی‌سرپرست رها شود، هر کسی با دسترسی فیزیکی یا از راه دور می‌تواند آن را برباید.
- سرور هر ۳۰۰ ثانیه (۵ دقیقه) یک پیام keep-alive می‌فرستد.
- اگر کلاینت به ۲ پیام متوالی پاسخ ندهد (در مجموع ۱۰ دقیقه)، نشست خاتمه می‌یابد.

---

## Summary Table / جدول خلاصه

| # | Setting | Before (Default) | After (Hardened) | Priority |
|---|---------|------------------|------------------|:--------:|
| 1 | `PermitRootLogin` | `#PermitRootLogin prohibit-password` | `PermitRootLogin no` | 🔴 High |
| 2 | `PasswordAuthentication` | `#PasswordAuthentication yes` | `PasswordAuthentication no` | 🔴 High |
| 3 | `Port` | `#Port 22` | `Port 2222` | 🟡 Medium |
| 4 | `MaxAuthTries` | `#MaxAuthTries 6` | `MaxAuthTries 3` | 🟡 Medium |
| 5 | `ClientAliveInterval` | `#ClientAliveInterval 0` | `ClientAliveInterval 300` | 🟢 Low |

---

## 🔧 How to Apply / نحوه اعمال تغییرات

**Step 1 — Backup the config file / گام ۱ — پشتیبان‌گیری از فایل کانفیگ:**
```bash
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup
```

**Step 2 — Edit the config file / گام ۲ — ویرایش فایل کانفیگ:**
```bash
sudo nano /etc/ssh/sshd_config
```

**Step 3 — Test the syntax / گام ۳ — تست صحت سینتکس:**
```bash
sudo sshd -t
```
If no output → config is valid. / اگر خروجی نداد → کانفیگ معتبر است.

**Step 4 — Restart the SSH service / گام ۴ — ری‌استارت سرویس SSH:**
```bash
sudo systemctl restart sshd
```

**Step 5 — Test the new connection in a NEW terminal / گام ۵ — تست اتصال جدید در یک ترمینال جدید:**
```bash
ssh -p 2222 user@server_ip
```

> **CRITICAL WARNING / هشدار حیاتی:**
> NEVER close your current SSH session before verifying that you can connect through a **new** terminal. Otherwise, you may lock yourself out of the server permanently.
>
> هرگز نشست SSH فعلی خود را قبل از اطمینان از اتصال از طریق یک ترمینال **جدید** نبندید. در غیر این صورت، ممکن است دسترسی خود را برای همیشه از سرور قطع کنید.

---

## Additional Recommendations (Optional) / توصیه‌های اضافی (اختیاری)

- **Fail2Ban:** Automatically ban IPs after repeated failed attempts.
  ```bash
  sudo apt install fail2ban
  ```
- **Two-Factor Authentication (2FA):** Add an extra layer with Google Authenticator.
  ```bash
  sudo apt install libpam-google-authenticator
  ```
- **AllowUsers / DenyUsers:** Restrict which users can log in via SSH.
  ```
  AllowUsers alice bob
  ```
- **Logging:** Enable verbose logging for auditing.
  ```
  LogLevel VERBOSE
  ```

---

## References / منابع

- [OpenSSH Manual](https://man.openbsd.org/sshd_config)
- [CIS Benchmark for Linux](https://www.cisecurity.org/benchmark/distribution_independent_linux)
- [NIST SP 800-123 Guide to General Server Security](https://csrc.nist.gov/publications/detail/sp/800-123/final)

---