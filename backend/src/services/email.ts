import { Resend } from "resend";
import { env } from "../config/env";

type DadosEmail = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

function getResendClient() {
  if (!env.resendApiKey) {
    throw new Error("RESEND_API_KEY não foi configurada.");
  }

  return new Resend(env.resendApiKey);
}

export async function enviarEmail({to, subject, html, text}: DadosEmail) {
    const resend = getResendClient();
    const {data, error} = await resend.emails.send({
        from: env.emailFrom || "Portal Cultural <no-reply@updates.seudominio.com>",
        to: [to],
        subject: subject,
        html: html,
        text: text,
    });
    
    if (error) {
        console.error("Erro ao enviar email:", error);
        throw new Error("Não foi possível enviar o email.");
    }

    return data;
    
}
