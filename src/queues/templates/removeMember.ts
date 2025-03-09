import { baseTemplate } from './baseTemplate';

export const removeTeamMemberEmail = (data: { adminName: string; removedMemberName: string; teamName: string }) => {
	return baseTemplate(
		`<h2>Hello, ${data.removedMemberName},</h2>
        <p>
            We want to inform you that you have been removed from the team <strong>${data.teamName}</strong> by <strong>${data.adminName}</strong>.
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
                                <span style="font-size: 22px; font-weight: bold; color: red;">
                                    You have been removed from the team.
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
            If you believe this was a mistake or need further assistance, please contact your team administrator or reach out to our support team.
        </p>

        <p>Thanks,<br />The 100minds Team</p>`
	);
};
