"use client";

import React, { useEffect, useMemo, useState } from "react";

import type { FormTemplateConfig } from "@/lib/form-template/types";

const VN_PHONE = /^(?:\+?84|0)(3|5|7|8|9)\d{8}$/;

function normalizePhone(p: string) {
  p = String(p || "").replace(/[^\d+]/g, "");
  if (p.startsWith("0")) return "+84" + p.slice(1);
  if (p.startsWith("+84")) return p;
  return p;
}

// Helper function to get cookie value
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

// Helper function to get fbclid from URL
function getFbclid(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get("fbclid") || null;
}

// Helper function to generate _fbc value
function generateFbc(): string | null {
  const fbclid = getFbclid();
  if (fbclid) {
    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
    return `fb.1.${timestamp}.${fbclid}`;
  }
  return null;
}

// Helper function to get user IP (via external API)
async function getUserIP(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip || "";
  } catch {
    return "";
  }
}

type Props = { config: FormTemplateConfig };

export default function TemplateRenderer({ config }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");

  const [modal, setModal] = useState<{ show: boolean; ok: boolean; title: string; message: string }>({
    show: false,
    ok: true,
    title: "Gửi thành công",
    message: "Cảm ơn bạn! Mã quà sẽ được gửi ngay.",
  });

  // form state (giữ nguyên field names để webhook/n8n dễ map)
  const [values, setValues] = useState<Record<string, string>>({
    full_name: "",
    phone: "",
    email: "",
    user_id: "",
    q1: "",
    q2: "",
    q3: "",
    q4: "",
    q5: "",
  });

  const themeVars = useMemo(
    () =>
      ({
        ["--bg" as any]: config.theme.bg,
        ["--card" as any]: config.theme.card,
        ["--primary" as any]: config.theme.primary,
        ["--primary-2" as any]: config.theme.primary2,
        ["--text" as any]: config.theme.text,
        ["--muted" as any]: config.theme.muted,
        ["--ring" as any]: config.theme.ring,
      }) as React.CSSProperties,
    [config],
  );

  const templateStyle = config.templateStyle ?? "default";
  const staticStars = useMemo(
    () => [
      { top: "12%", left: "18%", delay: "0.2s" },
      { top: "28%", left: "72%", delay: "0.6s" },
      { top: "8%", left: "48%", delay: "1s" },
      { top: "42%", left: "12%", delay: "1.4s" },
      { top: "55%", left: "65%", delay: "1.8s" },
      { top: "68%", left: "28%", delay: "2.2s" },
      { top: "22%", left: "84%", delay: "2.6s" },
      { top: "76%", left: "44%", delay: "3s" },
      { top: "34%", left: "36%", delay: "3.4s" },
      { top: "16%", left: "62%", delay: "3.8s" },
      { top: "62%", left: "10%", delay: "4.2s" },
      { top: "48%", left: "88%", delay: "4.6s" },
      { top: "86%", left: "20%", delay: "5s" },
      { top: "6%", left: "30%", delay: "5.4s" },
      { top: "24%", left: "56%", delay: "5.8s" },
      { top: "38%", left: "8%", delay: "6.2s" },
      { top: "72%", left: "78%", delay: "6.6s" },
      { top: "82%", left: "52%", delay: "7s" },
      { top: "10%", left: "8%", delay: "7.4s" },
      { top: "58%", left: "40%", delay: "7.8s" },
    ],
    [],
  );
  const shootingStars = useMemo(() => Array.from({ length: 10 }, (_, idx) => idx), []);

  // ===== behavior: fill userid + prefill city/role =====
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);

    const userId = q.get(config.behavior.readUserIdFromQueryKey || "userid");
    if (userId) setValues((s) => ({ ...s, user_id: userId }));
  }, [config.behavior]);

  function openModal(ok: boolean, title: string, message: string) {
    setModal({ show: true, ok, title, message });
  }

  function setField(name: string, v: string) {
    setValues((s) => ({ ...s, [name]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    // Get user_id from URL
    const q = new URLSearchParams(window.location.search);
    const userId = q.get("user_id") || q.get("userid") || values.user_id;

    // Get fbp and fbc
    const fbpValue = getCookie("_fbp");
    const fbcValue = getCookie("_fbc") || generateFbc();

    // Get user IP
    const userIP = await getUserIP();

    // build payload theo config (bật/tắt field)
    const payload: Record<string, any> = {
      source: config.behavior.source || "zalo_webview_form",
      event_name: config.behavior.eventName || "",
      ua: navigator.userAgent,
      user_id: userId,
      ip: userIP,
      fbp: fbpValue || "",
      fbc: fbcValue || "",
    };

    // default fields
    if (config.fields.full_name.enabled) payload.full_name = values.full_name.trim();
    if (config.fields.phone.enabled) payload.phone = normalizePhone(values.phone.trim());
    if (config.fields.email.enabled) payload.email = values.email.trim();

    // Note: user_id đã được set từ URL ở trên, không ghi đè nữa

    // questions - gửi cả giá trị và nhãn
    for (const q of config.questions.slice(0, 5)) {
      if (!q.enabled) continue;
      payload[q.id] = (values[q.id] || "").trim();
      payload[`${q.id}_label`] = q.label; // gửi thêm nhãn câu hỏi
    }

    // validate bắt buộc
    const requiredMissing: string[] = [];
    if (config.fields.full_name.enabled && config.fields.full_name.required && !payload.full_name)
      requiredMissing.push("Họ và tên");
    if (config.fields.phone.enabled && config.fields.phone.required && !payload.phone)
      requiredMissing.push("Số điện thoại");
    if (config.fields.email.enabled && config.fields.email.required && !payload.email) requiredMissing.push("Email");

    // validate required questions
    for (const q of config.questions.slice(0, 5)) {
      if (q.enabled && q.required && !payload[q.id]) requiredMissing.push(q.label);
    }

    if (requiredMissing.length) {
      openModal(false, "Thiếu thông tin", `Vui lòng điền: ${requiredMissing.join(", ")}.`);
      return;
    }

    // validate phone giống cũ
    if (payload.phone && !VN_PHONE.test(payload.phone)) {
      openModal(false, "Số điện thoại chưa hợp lệ", "Vui lòng nhập dạng 0xxxxxxxxx hoặc +84xxxxxxxxx.");
      return;
    }

    try {
      setSubmitting(true);
      setStatusText("Đang xử lý, vui lòng đợi trong giây lát...");

      const res = await fetch(config.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {}

      if (res.ok && data.ok !== false) {
        openModal(true, "Checkin thành công", data.message || "Chúc bạn có trải nghiệm tuyệt vời tại sự kiện!");
        // reset (giữ user_id nếu đang có)
        setValues((s) => ({
          ...s,
          full_name: "",
          phone: "",
          email: "",
          clinic: "",
          full_name_nv: "",
          q1: "",
          q2: "",
          q3: "",
          q4: "",
          q5: "",
        }));
      } else {
        openModal(false, "Không thể checkin", data.message || "Hệ thống bận, vui lòng thử lại.");
      }
    } catch {
      openModal(false, "Mất kết nối", "Không thể gửi dữ liệu. Kiểm tra mạng hoặc thử lại sau.");
    } finally {
      setSubmitting(false);
      setStatusText("");
    }
  }

  const buttonText = submitting ? "Đang gửi..." : "Gửi thông tin";

  const starryCss =
    templateStyle === "starry"
      ? `
        .template-starry{
          background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
        }
        .template-starry .page{background:transparent;position:relative;z-index:2}
        .template-starry .container{position:relative;z-index:2}
        .template-starry .bubble{display:none}
        .template-starry .stars,
        .template-starry .static-stars,
        .template-starry .moon{position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none}
        .template-starry .stars{height:120%;transform:rotate(-45deg)}
        .template-starry .card{
          background:rgba(14,20,30,.82);
          box-shadow:0 30px 80px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.06);
          backdrop-filter:blur(6px);
        }
        .template-starry .card-head{background:linear-gradient(135deg,#1f3b63,#2b5a8e)}
        .template-starry .title{color:#eaf2ff;text-shadow:0 2px 16px rgba(0,0,0,.6)}
        .template-starry .subtitle{color:#c7d8f5}
        .template-starry label{color:#dbe7ff}
        .template-starry .input,
        .template-starry select,
        .template-starry textarea{
          background:rgba(9,14,22,.85);
          border:1px solid rgba(90,140,210,.35);
          color:#eaf2ff;
        }
        .template-starry .input:focus,
        .template-starry select:focus,
        .template-starry textarea:focus{
          border-color:#6aa8ff;
          box-shadow:0 0 0 4px rgba(106,168,255,.25);
        }
        .template-starry .btn{
          background:linear-gradient(135deg,#4b8bff,#7cc3ff);
          box-shadow:0 12px 26px rgba(75,139,255,.35);
        }
        .template-starry .desc,
        .template-starry .info_event,
        .template-starry .footer-note,
        .template-starry .mota,
        .template-starry h2{color:#cfe2ff}
        .template-starry .event-footer{
          background:linear-gradient(90deg,#19314e,#2c5a8e);
          color:#eaf2ff;
          box-shadow:0 18px 40px rgba(0,0,0,.35);
        }
        .template-starry .dot{box-shadow:0 0 12px rgba(255,255,255,.3)}
        .template-starry .star{
          --star-color:#fff;--star-tail-length:6em;--star-tail-height:2px;--star-width:calc(var(--star-tail-length)/6);
          --fall-duration:9s;--tail-fade-duration:var(--fall-duration);
          position:absolute;top:var(--top-offset);left:0;width:var(--star-tail-length);height:var(--star-tail-height);
          color:var(--star-color);background:linear-gradient(45deg,currentColor,transparent);border-radius:50%;
          filter:drop-shadow(0 0 6px currentColor);transform:translate3d(104em,0,0);
          animation:fall var(--fall-duration) var(--fall-delay) linear infinite,
            tail-fade var(--tail-fade-duration) var(--fall-delay) ease-out infinite;
        }
        @media (prefers-reduced-motion: no-preference){
          .template-starry .star::before,.template-starry .star::after{
            position:absolute;content:'';top:0;left:calc(var(--star-width)/-2);width:var(--star-width);height:100%;
            background:linear-gradient(45deg,transparent,currentColor,transparent);border-radius:inherit;animation:blink 2s linear infinite;
          }
          .template-starry .star::before{transform:rotate(45deg)}
          .template-starry .star::after{transform:rotate(-45deg)}
        }
        @keyframes fall{to{transform:translate3d(-30em,35em,0)}}
        @keyframes tail-fade{0%,50%{width:var(--star-tail-length);opacity:1}70%,80%{width:0;opacity:.4}100%{width:0;opacity:0}}
        @keyframes blink{50%{opacity:.6}}
        .template-starry .star:nth-child(1){--star-tail-length:6em;--top-offset:36vh;--fall-duration:8s;--fall-delay:1s}
        .template-starry .star:nth-child(2){--star-tail-length:4em;--top-offset:32vh;--fall-duration:12s;--fall-delay:1.2s}
        .template-starry .star:nth-child(3){--star-tail-length:5em;--top-offset:36vh;--fall-duration:10s;--fall-delay:1.5s}
        .template-starry .star:nth-child(4){--star-tail-length:4.5em;--top-offset:16vh;--fall-duration:8s;--fall-delay:.2s}
        .template-starry .star:nth-child(5){--star-tail-length:6em;--top-offset:32vh;--fall-duration:12s;--fall-delay:0s}
        .template-starry .star:nth-child(6){--star-tail-length:5.5em;--top-offset:28vh;--fall-duration:6s;--fall-delay:1.6s}
        .template-starry .star:nth-child(7){--star-tail-length:2.2em;--top-offset:10vh;--fall-duration:8s;--fall-delay:2.8s}
        .template-starry .star:nth-child(8){--star-tail-length:4.8em;--top-offset:2vh;--fall-duration:11s;--fall-delay:1.7s}
        .template-starry .star:nth-child(9){--star-tail-length:3em;--top-offset:23vh;--fall-duration:7s;--fall-delay:.4s}
        .template-starry .star:nth-child(10){--star-tail-length:5em;--top-offset:8vh;--fall-duration:9s;--fall-delay:3.1s}
        .template-starry .static-star{position:absolute;width:2px;height:2px;background:#fff;border-radius:50%;animation:twinkle 3s infinite ease-in-out}
        @keyframes twinkle{0%,100%{opacity:.3}50%{opacity:1}}
        .template-starry .moon{top:10%;right:15%;left:auto;width:80px;height:80px;border-radius:50%;background:#f5f3ce;
          box-shadow:0 0 20px #f5f3ce,0 0 40px #f5f3ce,0 0 60px #f5f3ce;animation:moonGlow 4s ease-in-out infinite alternate}
        @media (max-width:480px){.template-starry .moon{top:-5%;right:20%}}
        @keyframes moonGlow{0%{box-shadow:0 0 20px #f5f3ce,0 0 40px #f5f3ce,0 0 60px #f5f3ce}
          100%{box-shadow:0 0 30px #f5f3ce,0 0 60px #f5f3ce,0 0 90px #f5f3ce}}
      `
      : "";

  return (
    <div style={themeVars} className={`min-h-screen ${templateStyle === "starry" ? "template-starry" : ""}`}>
      {/* CSS giữ nguyên vibe, nhưng dùng CSS variables từ config */}
      <style>{`
        :root{
          --bg:${config.theme.bg};
          --card:${config.theme.card};
          --primary:${config.theme.primary};
          --primary-2:${config.theme.primary2};
          --text:${config.theme.text};
          --muted:${config.theme.muted};
          --ring:${config.theme.ring};
          --ok:#16a34a;
          --err:#dc2626;
        }
        *{box-sizing:border-box}
        body{margin:0}
        .page{
          margin:0;
          font-family: Montserrat,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
          color:var(--text);
          background:
            radial-gradient(700px 400px at 10% 20%, rgba(255,190,220,.45), transparent 60%),
            radial-gradient(600px 350px at 90% 85%, rgba(255,170,210,.35), transparent 60%),
            linear-gradient(180deg,var(--bg),#fbd1e5);
          padding:24px;
          overflow-x:hidden;
          padding-bottom:100px;
        }
        .container{position:relative;max-width:680px;margin:auto}
        .bubble{
          position:absolute;width:220px;height:220px;border-radius:50%;
          z-index:1;pointer-events:none;will-change:transform;transform:translate3d(0,0,0);
          background:radial-gradient(circle at 30% 30%,
            rgba(255,255,255,.95),
            rgba(255,255,255,.55) 30%,
            rgba(236,95,164,.45) 55%,
            rgba(236,95,164,.25) 70%,
            transparent 75%);
          box-shadow:inset 0 0 30px rgba(255,255,255,.45),0 20px 40px rgba(236,95,164,.25);
          animation:floatBubble 12s ease-in-out infinite;
        }
        .bubble:nth-child(1){top:-80px;left:-90px;transform:scale(1);animation-delay:-2s}
        .bubble:nth-child(2){top:120px;right:-100px;transform:scale(.75);animation-delay:-4s}
        .bubble:nth-child(3){bottom:160px;left:-70px;transform:scale(.6);animation-delay:-6s}
        .bubble:nth-child(4){bottom:-90px;right:40px;transform:scale(.85);animation-delay:-3s}
        .bubble:nth-child(5){top:42%;left:68%;transform:scale(.5);animation-delay:-5s}
        @keyframes floatBubble{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}
        .heading{max-width:400px;display:block;margin:0 auto 18px;position:relative;z-index:3}
        .card{
          position:relative;z-index:10;background:var(--card);border-radius:26px;
          box-shadow:0 35px 90px rgba(236,95,164,.3),inset 0 0 0 1px rgba(255,255,255,.7);
          overflow:hidden;max-width:540px;margin:0 auto;
        }
        .card::after{
          content:"";position:absolute;inset:0;border-radius:26px;pointer-events:none;
          box-shadow:inset 0 0 0 1px rgba(255,255,255,.35);
        }
        .card-head{padding:30px 28px 18px;background:linear-gradient(90deg,var(--primary-2),var(--primary))}
        .title{margin:0 0 6px;font-size:26px;font-weight:900;text-align:center;color:#fff;letter-spacing:.5px;text-transform:uppercase}
        .subtitle{text-align:center;font-size:14px;color:#ffe8f2}
        form{padding:24px 28px 30px}
        .field{margin-bottom:14px}
        label{display:block;font-weight:600;margin-bottom:6px;color:var(--text)}
        .input,select,textarea{
          width:100%;padding:13px 15px;font-size:15px;border-radius:14px;border:1px solid #f3b3cf;
          background:#fff;color:var(--text);outline:none;transition:.2s
        }
        textarea{min-height:92px;resize:vertical}
        .input:focus,select:focus,textarea:focus{border-color:var(--primary);box-shadow:0 0 0 4px var(--ring)}
        .btn{
          width:100%;border:none;border-radius:14px;padding:14px 18px;font-weight:800;font-size:15px;cursor:pointer;color:#fff;
          background:linear-gradient(135deg,var(--primary),var(--primary-2));
          box-shadow:0 10px 20px rgba(236,95,164,.45);transition:.15s;margin-bottom:16px
        }
        .btn:hover{transform:translateY(-1px);box-shadow:0 16px 28px rgba(236,95,164,.45)}
        .btn:disabled{opacity:.6;cursor:not-allowed}
        .footer-note{padding:0 36px 24px;font-size:12px;line-height:18px;color:#9b5473;text-align:center;font-style:italic}
        .desc{font-size:18px;font-weight:500;color:#dd4b8a;text-align:center;margin:0 0 20px}
        .info_event{text-align:center;margin-top:32px;font-size:14px;color:#dd4b8a;font-weight:500}
        h2{margin:8px 0;font-size:40px;color:#dd4b8a}
        .mota{font-size:16px;font-weight:600}
        .logo{max-width:120px;margin:0 18px}
        .event-footer{
          margin-top:24px;padding:20px 24px 22px;
          background:linear-gradient(90deg,${config.footer.gradientFrom},${config.footer.gradientTo});
          border-radius:22px;color:${config.footer.textColor};z-index:5;position:relative;
          box-shadow:0 22px 50px rgba(236,95,164,.25), inset 0 0 0 1px rgba(255,255,255,.35);
        }
        .event-inner{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .event-col{flex:1;font-size:12px;line-height:1.4}
        .event-col.center{text-align:center}
        .event-label{font-weight:700;font-size:20px;margin-bottom:6px}
        .footer-desc{font-size:12px;margin:0 0 8px !important}
        .dress-dots{display:flex;gap:6px}
        .dot{width:30px;height:30px;border-radius:50%}
        .event-date{display:flex;align-items:center;justify-content:center}
        .day{font-size:48px;font-weight:700;margin-right:8px}
        .month{font-size:24px;font-weight:600}
        .year{font-size:16px;font-weight:500}
        .event-time{font-size:16px;font-weight:600;margin-top:4px}
        .name_address{font-weight:700;font-size:20px;margin-bottom:12px}
        .location_address,.address{font-size:13px}
        .modal{position:fixed;inset:0;display:none;place-items:center;background:rgba(253,231,241,.65);backdrop-filter:blur(6px);z-index:50}
        .modal.show{display:grid}
        .modal-card{background:#fff;border-radius:22px;padding:24px;width:min(520px,94%);text-align:center;box-shadow:0 30px 90px rgba(236,95,164,.35)}
        .status{width:60px;height:60px;border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px}
        .status.ok{background:rgba(22,163,74,.12);color:var(--ok)}
        .status.err{background:rgba(220,38,38,.12);color:var(--err)}
        .modal h3{margin:6px 0;font-size:20px;color:var(--primary)}
        .modal p{margin:0;color:var(--text)}
        .modal .close{margin-top:16px;padding:10px 16px;border:none;border-radius:12px;font-weight:700;background:var(--primary);color:#fff;cursor:pointer}
        @media (max-width:480px){
          .page{padding:0}
          .container{max-width:100%;padding:12px;overflow:hidden}
          .card{border-radius:20px}
          form{padding:20px 16px 18px}
          .heading{max-width:280px;margin-bottom:12px}
          .title{font-size:22px}
          .input,select,textarea{font-size:14px;padding:12px 14px}
          .btn{padding:13px 16px;font-size:14px}
          label{font-size:15px}
          .card-head{padding:22px 20px 8px}
          .event-inner{flex-direction:column;text-align:center}
          .dress-dots{justify-content:center}
          h2{font-size:36px;font-weight:800;margin:0}
        }
        ${starryCss}
      `}</style>

      {templateStyle === "starry" && (
        <>
          <div className="static-stars">
            {staticStars.map((star, index) => (
              <span
                key={`static-${index}`}
                className="static-star"
                style={{ top: star.top, left: star.left, animationDelay: star.delay }}
              />
            ))}
          </div>
          <div className="moon" />
          <div className="stars">
            {shootingStars.map((idx) => (
              <div key={`star-${idx}`} className="star" />
            ))}
          </div>
        </>
      )}

      <div className="page">
        <div className="container">
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />
          <div className="bubble" />

          {config.header.headingImageUrl ? (
            <img className="heading" src={config.header.headingImageUrl} alt={config.header.headingAlt} />
          ) : null}
          <p className="desc">{config.header.descText}</p>

          <main className="card" role="main">
            <div className="card-head">
              <h1 className="title">{config.header.titleText}</h1>
              <p className="subtitle">{config.header.subtitleText || ""}</p>
            </div>

            <form onSubmit={onSubmit} noValidate>
              {/* Default fields */}
              {config.fields.full_name.enabled && (
                <div className="field">
                  <label htmlFor="full_name">{config.fields.full_name.label}</label>
                  <input
                    className="input"
                    id="full_name"
                    value={values.full_name}
                    onChange={(e) => setField("full_name", e.target.value)}
                    placeholder={config.fields.full_name.placeholder}
                    required={config.fields.full_name.required}
                  />
                </div>
              )}

              {config.fields.phone.enabled && (
                <div className="field">
                  <label htmlFor="phone">{config.fields.phone.label}</label>
                  <input
                    className="input"
                    id="phone"
                    inputMode="tel"
                    value={values.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder={config.fields.phone.placeholder}
                    required={config.fields.phone.required}
                  />
                </div>
              )}

              {config.fields.email.enabled && (
                <div className="field">
                  <label htmlFor="email">{config.fields.email.label}</label>
                  <input
                    className="input"
                    id="email"
                    inputMode="email"
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder={config.fields.email.placeholder}
                    required={config.fields.email.required}
                  />
                </div>
              )}

              {/* user_id: giữ dạng hidden thật */}
              {config.fields.hidden.user_id?.enabled && <input type="hidden" value={values.user_id} readOnly />}

              {/* 5 câu hỏi custom */}
              {config.questions.slice(0, 5).map((q) => {
                if (!q.enabled) return null;

                if (q.type === "textarea") {
                  return (
                    <div className="field" key={q.id}>
                      <label htmlFor={q.id}>{q.label}</label>
                      <textarea
                        id={q.id}
                        value={values[q.id] || ""}
                        onChange={(e) => setField(q.id, e.target.value)}
                        placeholder={q.placeholder || ""}
                        required={q.required}
                      />
                    </div>
                  );
                }

                if (q.type === "select") {
                  const opts = (q.options || []).filter(Boolean);
                  return (
                    <div className="field" key={q.id}>
                      <label htmlFor={q.id}>{q.label}</label>
                      <select
                        id={q.id}
                        value={values[q.id] || ""}
                        onChange={(e) => setField(q.id, e.target.value)}
                        required={q.required}
                      >
                        <option value="">— Chọn —</option>
                        {opts.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                }

                const inputType = q.type === "email" ? "email" : q.type === "tel" ? "tel" : "text";

                return (
                  <div className="field" key={q.id}>
                    <label htmlFor={q.id}>{q.label}</label>
                    <input
                      className="input"
                      id={q.id}
                      type={inputType}
                      value={values[q.id] || ""}
                      onChange={(e) => setField(q.id, e.target.value)}
                      placeholder={q.placeholder || ""}
                      required={q.required}
                    />
                  </div>
                );
              })}

              <div className="actions" style={{ textAlign: "center", marginTop: 10 }}>
                <button className="btn" type="submit" disabled={submitting}>
                  {buttonText}
                </button>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>{statusText}</span>
              </div>
            </form>

            <div className="footer-note">
              Bằng việc gửi thông tin, bạn đồng ý cho phép chúng tôi liên hệ qua ZNS/SMS cho mục đích chăm sóc khách
              hàng theo chính sách bảo mật.
            </div>
          </main>

          <div className="info_event">
            <p>{config.infoEvent.topText}</p>
            <h2>{config.infoEvent.headline}</h2>
            <p className="mota">{config.infoEvent.motto}</p>
            <p>{config.infoEvent.organizerText}</p>

            <span style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "16px 0" }}>
              {config.infoEvent.logo1Url ? <img className="logo" src={config.infoEvent.logo1Url} alt="logo1" /> : null}
              {config.infoEvent.logo2Url ? <img className="logo" src={config.infoEvent.logo2Url} alt="logo2" /> : null}
            </span>

            <p>{config.infoEvent.bottomText}</p>
          </div>

          <footer className="event-footer">
            <div className="event-inner">
              <div className="event-col">
                <div className="event-label">{config.footer.dressCodeTitle}</div>
                <p className="footer-desc">{config.footer.dressCodeDesc}</p>
                <div className="dress-dots">
                  <span className="dot" style={{ background: config.footer.dressDots.white }} />
                  <span className="dot" style={{ background: config.footer.dressDots.whitePink }} />
                  <span className="dot" style={{ background: config.footer.dressDots.pink }} />
                  <span className="dot" style={{ background: config.footer.dressDots.black }} />
                </div>
              </div>

              <div className="event-col center">
                <div className="event-date">
                  <div className="day">{config.footer.dateDay}</div>
                  <div>
                    <div className="month">{config.footer.dateMonth}</div>
                    <div className="year">{config.footer.dateYear}</div>
                  </div>
                </div>
                <div className="event-time">{config.footer.timeText}</div>
              </div>

              <div className="event-col">
                <div className="event-place">
                  <span className="name_address">{config.footer.placeName}</span>
                  <br />
                  <span className="location_address">{config.footer.placeLine1}</span>
                  <br />
                  <span className="address">{config.footer.placeLine2}</span>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Modal */}
        <section
          className={"modal" + (modal.show ? " show" : "")}
          onClick={(e) => e.target === e.currentTarget && setModal((s) => ({ ...s, show: false }))}
        >
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className={"status " + (modal.ok ? "ok" : "err")} aria-hidden="true">
              {modal.ok ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10Zm-1.1-6.1 6-6a1 1 0 1 0-1.4-1.4l-5.3 5.3-2.1-2.1a1 1 0 1 0-1.4 1.4l2.8 2.8a1 1 0 0 0 1.4 0Z" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Zm1-6h-2v2h2v-2Zm0-8h-2v6h2V8Z" />
                </svg>
              )}
            </div>
            <h3 id="modal-title">{modal.title}</h3>
            <p>{modal.message}</p>
            <button className="close" onClick={() => setModal((s) => ({ ...s, show: false }))}>
              Đã hiểu
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
