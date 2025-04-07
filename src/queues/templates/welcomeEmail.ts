import { baseTemplate } from './baseTemplate';

export const welcomeEmail = (data: { name: string }) => {
	return baseTemplate(
		`<h2>Hi ${data.name},</h2>

        <p>
            Welcome to <strong>100 Minds</strong> — we're thrilled to have you on this journey.
        </p>

        <p>
            You're about to experience a bold new way of learning. At 100 Minds, we combine AI, neuroscience and real-world insights to help first-line leaders like you grow stronger, faster, and more confidently in just minutes a day.
        </p>

        <p>
            <strong>Our mission is simple:</strong><br/>
            👉 To make leadership development human again and radically more effective.
        </p>

        <h3>💡 Here’s what to expect:</h3>
        <ul>
            <li>Your own <strong>AI Coach</strong>, guiding you through key leadership skills</li>
            <li><strong>Bite-sized capsules</strong>, built for your world and your pace</li>
            <li><strong>Tools</strong> to help you lead yourself, lead others, and lead change</li>
        </ul>

        <p>
            This is more than just a course. It’s the first step in advancing your career by training the leadership and PowerSkills that set great professionals apart.
        </p>

        <p>
            Whether you're looking to grow in your current role or prepare for the next one, this journey will help you get there.
        </p>

        <hr style="margin: 24px 0;" />

        <h3>🔒 Your privacy is safe with us:</h3>
        <ul>
            <li>Nothing you share with the AI coach is recorded or stored</li>
            <li>Your personal data stays private always</li>
            <li>We follow strict data security and confidentiality standards</li>
        </ul>
        <p>You’re in full control, and we’re here if you have questions.</p>

        <p>
            <a href="https://app.100-minds.com/privacy-policy" style="color: #099999; font-weight: bold;">Read more about how we protect your information →</a>
        </p>

        <hr style="margin: 24px 0;" />

        <p>
            We’re excited to grow with you.<br />
            <strong>Let’s get started.</strong><br />
            The 100 Minds Team
        </p>`
	);
};
