import React from 'react';
import logo from '../../assets/logo.jpeg';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
          <img src={logo} alt="Nudge2Grow Logo" className="h-10 w-auto object-contain" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: February 26, 2026</p>
          <div className="mt-4 h-1 w-16 bg-[#45a578] rounded-full" />
        </div>

        {/* Intro */}
        <p className="text-gray-600 text-base leading-relaxed mb-10">
          At Nudge2Grow, we are committed to protecting your privacy and ensuring the security of
          your personal information. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our platform and services.
        </p>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Personal Identification:</strong> Name, email address, phone number, and profile details you provide during registration.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Child Information:</strong> Your child's name, age, grade, and educational board to personalise their learning experience.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Learning Progress Data:</strong> Topics completed, quiz scores, flashcard activity, and assessment results.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Device Information:</strong> Device type, operating system, app version, and unique device identifiers.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Usage Data:</strong> How you interact with the app, features used, time spent, and navigation patterns.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>To create and manage your account and provide access to all platform features.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>To personalise your child's learning journey based on their grade, subject preferences, and progress.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>To send push notifications, learning nudges, and important updates about new content.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>To analyse usage patterns and improve the quality, performance, and features of our service.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>To process subscription payments and manage billing securely.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>To respond to your support requests, feedback, and enquiries promptly.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We <strong className="text-gray-800">do not sell</strong> your personal information to any third party under any circumstances.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We may share data with trusted service providers (e.g., cloud hosting, payment processors) who assist in operating our platform, under strict confidentiality agreements.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We may disclose information when required by law, court order, or government authority.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Aggregated, anonymised data may be used for research and analytics purposes without identifying individual users.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Data Security</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>All data is transmitted using industry-standard SSL/TLS encryption to protect it in transit.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Passwords and sensitive credentials are stored using secure hashing algorithms and are never stored in plain text.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Access to user data is restricted to authorised personnel only, on a need-to-know basis.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We regularly review and update our security practices to address emerging threats.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Despite our best efforts, no method of internet transmission is 100% secure. We encourage you to use a strong password and keep your account credentials confidential.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Access:</strong> You can request a copy of the personal data we hold about you at any time.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Correction:</strong> You can update or correct inaccurate information through your account settings.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Deletion:</strong> You can request deletion of your account and associated data by contacting our support team.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Opt-out:</strong> You can opt out of marketing communications at any time via your notification settings.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span><strong className="text-gray-800">Portability:</strong> You may request an export of your data in a commonly used format.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">6. Children's Privacy</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Nudge2Grow is designed for parents and guardians to manage their child's learning. Accounts are created and managed by adults.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We do not knowingly collect personal information directly from children under the age of 13 without verifiable parental consent.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>If you believe we have inadvertently collected information from a child without consent, please contact us immediately and we will take prompt action to delete it.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">7. Cookies & Tracking</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We use cookies and similar tracking technologies to maintain your session and remember your preferences.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Analytics cookies help us understand how users interact with the platform so we can improve it.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>You can control cookie preferences through your browser settings. Disabling cookies may affect some functionality.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 8 */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We will notify you of significant changes via email or an in-app notification before they take effect.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Continued use of the platform after changes are posted constitutes your acceptance of the updated policy.</span>
            </li>
          </ul>
        </section>

        <div className="border-t border-gray-100 mb-8" />

        {/* Section 9 — Contact */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
          <ul className="space-y-3 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>Email: <a href="mailto:support@nudge2grow.com" className="text-[#45a578] underline">support@nudge2grow.com</a></span>
            </li>
            <li className="flex gap-2">
              <span className="text-[#45a578] font-bold mt-0.5">•</span>
              <span>We aim to respond to all privacy-related enquiries within 5 business days.</span>
            </li>
          </ul>
        </section>

        {/* Footer */}
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} Nudge2Grow. All rights reserved.</p>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
