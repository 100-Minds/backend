import { baseTemplate } from './baseTemplate';

export const videoUploadFailedEmail = (data: { courseName: string; chapterNumber: number }) => {
	return baseTemplate(
		`<h2>Video Upload Failed</h2>
        <p>
            Unfortunately, the video upload for <strong>Chapter ${data.chapterNumber}</strong> in the course <strong>${data.courseName}</strong> has failed.
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
                                    Upload Unsuccessful
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
            Please check your internet connection and file format, then try re-uploading the video. If the issue persists, contact support for assistance.
        </p>

        <p>Thanks,<br />The 100minds Team</p>`
	);
};
