import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MeetZap - Find the Perfect Time to Meet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FFF8E7",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#FFE500",
              border: "3px solid #000",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "4px 4px 0px 0px #000",
              fontSize: "36px",
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontSize: "56px",
              fontWeight: 900,
              color: "#000",
              letterSpacing: "-2px",
            }}
          >
            MeetZap
          </span>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "#525252",
            fontWeight: 500,
            maxWidth: "600px",
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          The easiest free scheduling tool for everyone.
        </p>
      </div>
    ),
    { ...size }
  );
}
