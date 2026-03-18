import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { feedback, url, timestamp } = await request.json();

    if (!feedback || !feedback.trim()) {
      return NextResponse.json(
        { error: "Feedback is required" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "alerts@qyvex.tech",
      to: "roulommprakash5@gmail.com",
      subject: `🐛 Bug Report from Qyvex - ${new Date(timestamp).toLocaleString()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #06b6d4;">
            <h2 style="color: #0f172a; margin-top: 0;">🐛 New Bug Report</h2>
            
            <div style="margin: 20px 0; padding: 15px; background-color: #f0f9ff; border-radius: 5px; border-left: 3px solid #0284c7;">
              <h3 style="color: #0c4a6e; margin-top: 0;">Feedback:</h3>
              <p style="color: #1e293b; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word;">${feedback}</p>
            </div>

            <div style="margin: 20px 0; padding: 15px; background-color: #f8fafc; border-radius: 5px;">
              <h3 style="color: #475569; margin-top: 0; font-size: 14px;">Details:</h3>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong>Page URL:</strong> ${url}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong>Timestamp:</strong> ${new Date(timestamp).toLocaleString()}</p>
              <p style="margin: 5px 0; color: #64748b; font-size: 14px;"><strong>IP Address:</strong> ${request.headers.get("x-forwarded-for") || "Not available"}</p>
            </div>

            <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 12px;">
              <p>This is an automated email from Qyvex bug reporting system.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      return NextResponse.json(
        { error: "Failed to submit bug report" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Bug report submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending bug report email:", error);
    return NextResponse.json(
      { error: "Failed to submit bug report" },
      { status: 500 }
    );
  }
}
