import { baseTemplate } from './baseTemplate';

export const teamInviteEmail = (data: {
	inviterName: string;
	inviteeName: string;
	teamName: string;
	inviteLink: string;
}) => {
	return baseTemplate(
		`<h2>Hello, ${data.inviteeName}!</h2>
        <p>
            <strong>${data.inviterName}</strong> has invited you to join the team <strong>${data.teamName}</strong> on 100minds.
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
                                <a href="${data.inviteLink}" class="button" style="background-color:rgb(112, 232, 224); border-radius: 20px; color: #163300; display: inline-block; text-decoration: none; padding: 12px 30px; font-size: 16px;">
                                    Accept Invitation
                                </a>
                            </td>
                        </tr>
                    </table>
                    </td>
                 </tr>
                </table>
              </td>
            </tr>
        </table>

        <p>
            This invitation link is valid for <strong>7 days</strong>. If you did not expect this invite, you can safely ignore this email.
        </p>

        <p>Thanks,<br />The 100minds Team</p>`
	);
};
