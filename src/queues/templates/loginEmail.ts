import { baseTemplate } from './baseTemplate';

export const loginEmail = (data: { name: string; otp: string }) => {
	return baseTemplate(
		`<h2>Hey ${data.name}!</h2>
        <p>
            Here’s your one-time login code to access your 100 Minds account:
        </p>

        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                 <tr>
                    <td align="center">
                    <table border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td>
                                <span style="font-size: 28px; font-weight: bold; color: #099999;">
                                    🔐 ${data.otp}
                                </span>
                            </td>
                        </tr>
                    </table>
                    </td>
                 </tr>
                </table>
              </td>
            </tr>
        </table>

        <p>This code is valid for the next 5 minutes.</p>

        <p>
            If you didn’t try to log in, you can safely ignore this message or contact our support team if you have any concerns.
        </p>

        <p>Let’s get you back into action 💪<br />The 100 Minds Team</p>`
	);
};
