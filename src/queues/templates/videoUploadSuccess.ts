import { baseTemplate } from './baseTemplate';

export const videoUploadSuccessEmail = (data: { chapterNumber: number; courseName: string }) => {
	return baseTemplate(
		`<h2>Video Upload Successful!</h2>
        <p>
            Great news! Your video for <strong>Chapter ${data.chapterNumber}</strong> of the course <strong>${data.courseName}</strong> has been successfully uploaded.
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
                                    Your lesson is now available!
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
            You can now review your uploaded video and ensure everything is as expected.
        </p>

        <p>
            If you have any issues, feel free to reach out to support.
        </p>

        <p>Thanks,<br />The 100minds Team</p>`
	);
};
