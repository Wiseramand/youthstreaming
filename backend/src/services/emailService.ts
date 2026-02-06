const nodemailer = require('nodemailer');
import { User } from '../types';

export interface StreamLink {
  id: string;
  title: string;
  url: string;
  accessCode: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVipCredentials(user: User, password: string, streamLinks: StreamLink[]) {
    const streamLinksHtml = streamLinks.map(link => `
      <div style="background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #0d6efd;">
        <h4 style="margin: 0 0 5px 0; color: #212529;">${link.title}</h4>
        <p style="margin: 5px 0; color: #6c757d;">Código de Acesso: <strong style="color: #0d6efd;">${link.accessCode}</strong></p>
        <a href="${link.url}" style="background: #0d6efd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">Acessar Transmissão</a>
      </div>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0d6efd; margin: 0;">Youth Angola</h1>
          <p style="color: #6c757d; margin: 10px 0 0 0;">Seu acesso VIP está pronto!</p>
        </div>
        
        <div style="background: #e7f3ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #0d6efd;">Credenciais de Acesso</h3>
          <p style="margin: 5px 0;"><strong>Nome de Usuário:</strong> ${user.email}</p>
          <p style="margin: 5px 0;"><strong>Senha:</strong> <span style="background: #f8f9fa; padding: 2px 8px; border-radius: 4px; font-family: monospace;">${password}</span></p>
          <p style="margin: 15px 0 0 0; font-size: 12px; color: #6c757d;">Recomendamos alterar sua senha após o primeiro acesso.</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="margin: 0 0 15px 0; color: #212529;">Transmissões Exclusivas</h3>
          ${streamLinksHtml}
        </div>

        <div style="border-top: 1px solid #dee2e6; padding-top: 20px; text-align: center; color: #6c757d; font-size: 14px;">
          <p style="margin: 0;">Para acessar, use suas credenciais acima no nosso portal VIP.</p>
          <p style="margin: 10px 0 0 0;">Se precisar de ajuda, responda a este email.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: '🎉 Seu Acesso VIP Youth Angola - Credenciais e Links Exclusivos',
      html: html,
      text: `Olá ${user.name},\n\nSeu acesso VIP está pronto!\n\nCredenciais:\nUsuário: ${user.email}\nSenha: ${password}\n\nLinks exclusivos: ${streamLinks.map(s => s.title + ': ' + s.url).join('\n')}\n\nAcesse agora: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Email enviado para ${user.email}`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  async sendStreamNotification(user: User, stream: StreamLink) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #198754; margin: 0;">Youth Angola</h1>
          <p style="color: #6c757d; margin: 10px 0 0 0;">Nova Transmissão Disponível!</p>
        </div>
        
        <div style="background: #d1e7dd; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #198754;">
          <h3 style="margin: 0 0 15px 0; color: #198754;">${stream.title}</h3>
          <p style="margin: 5px 0; color: #212529;">Código de Acesso: <strong style="color: #198754;">${stream.accessCode}</strong></p>
          <a href="${stream.url}" style="background: #198754; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; font-weight: bold;">Acessar Agora</a>
        </div>

        <div style="text-align: center; color: #6c757d; font-size: 14px;">
          <p style="margin: 0;">Use suas credenciais VIP para acessar.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: user.email,
      subject: `🎬 Nova Transmissão: ${stream.title}`,
      html: html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();