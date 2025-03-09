import { baseTemplate } from './baseTemplate';

export const teamInviteSuccessEmail = (data: { inviterName: string; inviteeName: string; teamName: string }) => {
	return baseTemplate(
		`<h2>Hello, ${data.inviteeName}!</h2>
        <p>
            Congratulations! You have successfully joined the team <strong>${data.teamName}</strong> on 100minds.
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
                                <span style="font-size: 22px; font-weight: bold;">
                                    Welcome to the team!
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

        <p>
            <strong>${data.inviterName}</strong> invited you to join this team, and now you can start collaborating with your teammates.
        </p>

        <p>
            To get started, log in to your account and explore your team's resources.
        </p>

        <p>Thanks,<br />The 100minds Team</p>`
	);
};
