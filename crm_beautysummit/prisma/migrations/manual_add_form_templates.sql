-- Migration: Add form_templates table
-- Chạy script này trên database của bạn

CREATE TABLE IF NOT EXISTS `form_templates` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `configJson` JSON NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `form_templates_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default template
INSERT INTO `form_templates` (`slug`, `name`, `isActive`, `configJson`)
VALUES (
  'eac-checkin',
  'EAC Check-in',
  true,
  '{
    "webhookUrl": "https://nextg.nextgency.vn/webhook/EAC-dang-ky",
    "theme": {
      "bg": "#fde7f1",
      "card": "rgba(255,255,255,.92)",
      "primary": "#ec5fa4",
      "primary2": "#f7a1c4",
      "text": "#7a2b4b",
      "muted": "#b06a8c",
      "ring": "rgba(236,95,164,.35)"
    },
    "header": {
      "headingImageUrl": "https://statics.pancake.vn/web-media/18/f6/71/e6/76c1495e525e89899ae0090a0f9d30cf8a3aedfcf89e51c64f245175-w:1280-h:560-l:613547-t:image/png.png",
      "headingAlt": "SGA Penew Pêl",
      "descText": "We cordially invite",
      "titleText": "Check in sự kiện",
      "subtitleText": ""
    },
    "infoEvent": {
      "topText": "to attend the launch event",
      "headline": "SGA Renew Peel",
      "motto": "Đa tầng Tác Động, Dứt Vòng Mụn Thâm",
      "organizerText": "organized by EAC Group and SRX Laboratory Dermatology",
      "bottomText": "We would be honored to have you at the event",
      "logo1Url": "https://statics.pancake.vn/web-media/4b/c7/06/08/f8e7d877ec55a6dbda6a7a9b95e9b4def686e05a6f4008ecf0870cc7-w:1200-h:628-l:37202-t:image/png.png",
      "logo2Url": "https://statics.pancake.vn/web-media/c7/26/2c/a7/89cee08c3f61654d699786777490449c70fb8bce6559a21972daf14e-w:1200-h:628-l:34821-t:image/png.png"
    },
    "fields": {
      "full_name": {"enabled": true, "required": true, "label": "Họ và tên", "placeholder": "VD: Nguyễn Văn A"},
      "phone": {"enabled": true, "required": true, "label": "Số điện thoại", "placeholder": "VD: 0912345678"},
      "email": {"enabled": true, "required": false, "label": "Email", "placeholder": "VD: abc@email.com"},
      "hidden": {
        "user_id": {"enabled": true},
        "city": {"enabled": true},
        "role": {"enabled": true},
        "clinic": {"enabled": true},
        "full_name_nv": {"enabled": true}
      }
    },
    "questions": [],
    "footer": {
      "gradientFrom": "#f7a1c4",
      "gradientTo": "#ec5fa4",
      "textColor": "#ffffff",
      "dressCodeTitle": "DRESS CODE",
      "dressCodeDesc": "Vui lòng mặc trang phục lịch sự",
      "dressDots": {
        "white": "Áo trắng",
        "whitePink": "Hồng pastel",
        "pink": "Hồng đậm",
        "black": "Đen"
      },
      "dateDay": "20",
      "dateMonth": "12",
      "dateYear": "2024",
      "timeText": "14:00 - 17:00",
      "placeName": "Khách sạn New World",
      "placeLine1": "76 Lê Lai, Bến Thành",
      "placeLine2": "Quận 1, TP.HCM"
    }
  }'
)
ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `configJson` = VALUES(`configJson`);
