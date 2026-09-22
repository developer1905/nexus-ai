# Nexus AI Agent SaaS — Ishga Tushirish va AWS Serveriga Joylash Qo‘llanmasi

Ushbu loyiha **Production-Ready Multi-Agent AI SaaS** platformasi bo‘lib, unda:
- **Navy AI** (`sk-navy-b5HS...lMUM`) va universal **JARVIS** agenti;
- **OpenRouter Bepul Modellari** (DeepSeek R1, Llama 3.3 70B, Qwen 2.5 Coder, Mistral Small);
- **Mistral AI** rasmiy modellari (Codestral 2501, Mistral Large 2, Pixtral 12B);
- **Google Gemini 3.6 Flash** native integratsiyasi;
- **Telegram AI Agent Ekotizimi** (5 rejimli guruhlar, kanallar va jonli ulangan bot `8993321594:AAFo1UtJ...`);
- **Favqulodda to‘xtatish (Emergency Stop)** tizimi mavjud.

---

## 1-QADAM: Loyihani GitHub ga Joylash (Push Qilish)

Loyihangiz papkasida terminalni oching va quyidagi buyruqlarni bajaring:

```bash
# 1. Git omborini boshlash
git init

# 2. Barcha fayllarni indekslash
git add .

# 3. Birinchi commitni amalga oshirish
git commit -m "feat: complete Nexus AI SaaS with OpenRouter, Mistral, Navy AI and JARVIS"

# 4. Asosiy tarmoqni main ga o'zgartirish
git branch -M main

# 5. GitHub dagi yangi bo'sh repository linkingizni qo'shing:
# (GitHub da yaratgan repozitoriyangiz manzilini qo'ying)
git remote add origin https://github.com/SIZNING_GITHUB_USERNAME/nexus-ai-agent-saas.git

# 6. GitHub ga yuklash
git push -u origin main
```

---

## 2-QADAM: AWS EC2 Server Ochish va Ulanish

1. **AWS Console** (aws.amazon.com) ga kiring.
2. **EC2** xizmatiga o‘ting va **Launch Instance** tugmasini bosing:
   - **Name:** `nexus-ai-server`
   - **OS (AMI):** `Ubuntu Server 24.04 LTS` yoki `Ubuntu 22.04 LTS`
   - **Instance type:** `t3.small` yoki `t3.medium` (tavsiya etiladi)
   - **Key pair:** Yangi `.pem` kalit yarating va kompyuteringizga yuklab oling (masalan, `nexus-key.pem`).
   - **Network settings (Security Group):**
     - ✅ Allow SSH traffic (Port 22)
     - ✅ Allow HTTP traffic (Port 80)
     - ✅ Allow HTTPS traffic (Port 443)
     - ✅ Custom TCP Rule: Port `8000` (Ixtiyoriy, API to‘g‘ridan-to‘g‘ri sinash uchun)
3. **Launch Instance** ni bosing.

4. Server ishga tushgach, o‘z kompyuteringiz terminalidan SSH orqali serverga ulaning:
```bash
chmod 400 nexus-key.pem
ssh -i "nexus-key.pem" ubuntu@SIZNING_AWS_PUBLIC_IP
```

---

## 3-QADAM: Serverda Loyihani GitHub dan Yuklab Olish

Server terminalida:

```bash
# 1. Server paketlarini yangilash
sudo apt-get update -y && sudo apt-get upgrade -y
sudo apt-get install -y git python3 python3-pip curl

# 2. GitHub dan loyihani yuklab olish (Clone)
git clone https://github.com/SIZNING_GITHUB_USERNAME/nexus-ai-agent-saas.git

# 3. Loyiha papkasiga kirish
cd nexus-ai-agent-saas
```

---

## 4-QADAM: AWS Serverda Ishga Tushirish (3 Xil Usul)

### 1-USUL: To‘g‘ridan-to‘g‘ri Ishga Tushirish (Tezkor Sinov)
Loyiha frontend va backendni yagona portda xizmat qiladi:
```bash
# Serverni port 8000 da ishga tushirish
python3 backend/server.py
```
Brauzerda oching: `http://SIZNING_AWS_PUBLIC_IP:8000`

---

### 2-USUL: Doimiy Fonda Ishlash (Systemd Service — Tavsiya etiladi)
Server o‘chib yonsa ham avtomatik qayta ishga tushishi uchun:

```bash
# Service faylini tizimga ko'chirish
sudo cp nexus-ai.service /etc/systemd/system/

# Serviceni faollashtirish va ishga tushirish
sudo systemctl daemon-reload
sudo systemctl enable nexus-ai
sudo systemctl start nexus-ai

# Holatini tekshirish
sudo systemctl status nexus-ai
```

---

### 3-USUL: Docker & Docker Compose orqali (Bitta Buyruq Bilan)
Agar serveringizda Docker o‘rnatilgan bo‘lsa:
```bash
sudo apt-get install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
# Yangi sessiyaga kirish yoki newgrp docker

docker compose up -d --build
```
Platforma to‘g‘ridan-to‘g‘ri standart **80-portda** ishlaydi: `http://SIZNING_AWS_PUBLIC_IP`

---

## 5-QADAM: Nginx va Bepul SSL (HTTPS) O‘rnatish

Platformangizni shaxsiy domeningizga ulash va xavfsiz HTTPS (SSL) sertifikatini o‘rnatish:

```bash
# 1. Nginx o'rnatish
sudo apt-get install -y nginx

# 2. Nginx konfiguratsiyasini ulash
sudo cp nginx.conf /etc/nginx/sites-available/nexus-ai
sudo ln -s /etc/nginx/sites-available/nexus-ai /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# 3. Bepul Let's Encrypt SSL (HTTPS) sertifikati olish
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d sizning-domeningiz.uz
```

---

## 6-QADAM: Telegram Webhook ni Serverga Ulash

Serveringizning HTTPS domeni tayyor bo‘lgach, botingiz webhookini AWS serveringizga biriktirishingiz mumkin:
```bash
curl -F "url=https://sizning-domeningiz.uz/api/telegram/webhook" \
     https://api.telegram.org/bot<SIZNING_BOT_TOKENINGIZ>/setWebhook
```
